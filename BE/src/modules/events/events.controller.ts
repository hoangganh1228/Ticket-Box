import { Controller, Get, Param, Query, Post, Body, Patch, Delete, UseGuards, Req, ParseIntPipe, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CreateSettingDto } from './dto/create-setting.dto';
import { CreatePaymentEventDto } from './dto/create-payment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { RedisService } from 'src/common/redis/redis.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { PermissionsGuard } from '../../common/guards/permisson.guard';
import { PermissionRoute } from '../../common/decorators/permission.decorator';
import { PERMISSION_CODE, PERMISSION_PATH } from '../../common/constants/permission.constant';
import { PermissionEventGuard } from 'src/common/guards/permissionEvent.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getMyEventDto } from './dto/get-my-event.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly fileUploadService: FileUploadService,
    private readonly redisService: RedisService,
  ) { }

  //danh sách event theo danh mục
  @Get('discovery/categories')
  getEvents() {
    const fakeIp = '113.22.17.0';
    return this.eventsService.getEvents(fakeIp);
  }

  @Get('/')
  getAll() {
    return this.eventsService.findAll();
  }

  @Get('my-events')
  @UseGuards(JwtAccessGuard)
  getMyEvents(@Req() req: any,
    @Query() pagination: PaginationQueryDto,
    @Query() type: getMyEventDto
  ) {
    const userId = req.user.sub;
    return this.eventsService.getMyEvents(userId, pagination, type);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'org_thumbnail', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAccessGuard)
  // @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(PERMISSION_CODE.CREATE_EVENT, 'events', 'POST', 'Create event')
  async create(
    @Req() req: any,
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files: {
      thumbnail: Express.Multer.File[],
      banner: Express.Multer.File[],
      org_thumbnail: Express.Multer.File[]
    },
  ) {

    const uploadedFiles = await this.fileUploadService.uploadEventFiles(files);
    // const user = req.user;

    Object.assign(createEventDto, uploadedFiles);
    const userId = req.user.sub;

    return this.eventsService.createWithOwner(userId, createEventDto);
  }


  @Patch(':id')
  @UseGuards(JwtAccessGuard, PermissionEventGuard)
  @PermissionRoute(PERMISSION_CODE.UPDATE_EVENT, PERMISSION_PATH.EVENT_PERMISSION, 'PATCH', 'Update event')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'org_thumbnail', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFiles() files?: {
      thumbnail?: Express.Multer.File[];
      banner?: Express.Multer.File[];
      org_thumbnail?: Express.Multer.File[];
    },
  ) {
    const uploadedFiles = files
      ? await this.fileUploadService.uploadEventFiles(files)
      : {};
    Object.assign(updateEventDto, uploadedFiles);
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':eventId/publish')
  publish(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventsService.publish(eventId);
  }

  //event theo tháng , tuần
  @Get('recommended-events')
  getEventsByWeekOrByMonth(
    @Query('at') at: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.eventsService.getEventsByWeekOrByMonth(at, from, to);
  }

  //banner
  @Get('discovery/banners')
  getEventsBanner() {
    return this.eventsService.getEventsBanner();
  }

  @Get('search')
  searchEvents(
    @Query("q") q?: string,
    @Query("cate") cate?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.eventsService.searchEvents({ q, cate, page: parseInt(page), limit: parseInt(limit) });
  }

  @Get('detail/:id')
  getEventDetail(@Param('id') id: string) {
    return this.eventsService.getEventDetail(+id);
  }

  @Get('event-suggestions/:id')
  getEventSuggestions(@Param('id') id: string) {
    return this.eventsService.getEventSuggestions(+id);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(id);
  }

  @Put('/:eventId/settings')
  createSetting(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createSettingDto: CreateSettingDto
  ) {
    return this.eventsService.createSetting(eventId, createSettingDto)
  }
  @Get('/:eventId/settings')
  getSetting(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventsService.getSettings(eventId);
  }
  @Put(':eventId/payment-info')
  createPaymentInfo(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createPaymentDto: CreatePaymentEventDto
  ) {
    return this.eventsService.createPaymentInfo(eventId, createPaymentDto)
  }


  @Get(':eventId/payment-info')
  getPaymentInfo(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventsService.getPaymentInfo(eventId);
  }

  // Test Redis
  @Get('redis/health')
  async checkRedisHealth() {
    const ping = await this.redisService.ping();
    return {
      status: ping === 'PONG' ? 'healthy' : 'unhealthy',
      ping,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('redis/test')
  async testRedis() {
    // Test set/get
    await this.redisService.set('test:key', { message: 'Hello Redis!' }, 60);
    const value = await this.redisService.get('test:key');

    return {
      message: 'Redis test completed',
      setValue: { message: 'Hello Redis!' },
      getValue: value,
      timestamp: new Date().toISOString(),
    };
  }


}
