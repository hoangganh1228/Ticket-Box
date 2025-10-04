const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINT: '/events/7/booking',
  TOTAL_REQUESTS: 200,  // 1000
  CONCURRENT_REQUESTS: 200, // Giảm xuống 5
  REQUEST_TIMEOUT: 30000,
};

// Booking data theo yêu cầu
const BOOKING_DATA = {
  event_id: 7,
  discount_amount: 10,
  items: [
    {
      ticket_id: 1,
      show_id: 1,
      quantity: 1,
      unit_price: 2000,
      special_requests: "Ghi chú cho vé này! HEHEHE"
    },
    {
      ticket_id: 2,
      show_id: 1,
      unit_price: 1000,
      quantity: 1,
      special_requests: "Ghi chú cho vé ưu đãi! HEHEHE"
    }
  ],
  phone: "0123456789",
  email: "hoanganh@example.com",
  address: "123 Main St",
  note: "Ghi chú đơn hàng"
};

// Statistics tracking
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  errors: {},
  responseTimes: [],
  startTime: null,
  endTime: null,
  successfulBookings: []
};

// Function to create unique booking data for each user
function createBookingData(userId) {
  return {
    ...BOOKING_DATA,
    userId: userId, // ✅ Thêm userId vào DTO body
    phone: `0123456${userId.toString().padStart(4, '0')}`,
    email: `user${userId}@example.com`,
    address: `${userId} Main St`,
    note: `Ghi chú đơn hàng ${userId}`
  };
}

// Function to make a single booking request
async function makeBookingRequest(userId) {
  const startTime = Date.now();
  
  try {
    const bookingData = createBookingData(userId);

    const response1 = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.ENDPOINT}`,
      bookingData,
      {
        timeout: CONFIG.REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    const responseTime = Date.now() - startTime;
    const response = response1.data;
    stats.success++;
    stats.responseTimes.push(responseTime);
    
    if (response.data.bookingId) {
      stats.successfulBookings.push({
        userId,
        bookingId: response.data.bookingId,
        orderNumber: response.data.orderNumber,
        responseTime,
        status: response.data.status
      });
    }
    
    console.log(`✅ User ${userId}: ${response.status} - ${responseTime}ms - ${response.data.status}`);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    stats.failed++;
    stats.responseTimes.push(responseTime);
    
    const errorKey = error.response?.status || error.code || 'UNKNOWN';
    stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
    
    console.log(`❌ User ${userId}: ${errorKey} - ${responseTime}ms - ${error.message}`);
    
    // Log error details for debugging
    if (error.response?.data) {
      console.log(`   Error details:`, error.response.data);
    }
  }
  
  stats.total++;
}

// Function to run batches of concurrent requests
async function runBatch(batchNumber, userIds) {
  const promises = userIds.map(userId => makeBookingRequest(userId));
  await Promise.all(promises);
  console.log(`📦 Batch ${batchNumber + 1} completed (${userIds.length} requests)`);
}

// Main load test function
async function runLoadTest() {
  console.log('�� Starting Load Test - 1000 Requests');
  console.log(`�� Target: ${CONFIG.TOTAL_REQUESTS} requests`);
  console.log(`⚡ Concurrent: ${CONFIG.CONCURRENT_REQUESTS} requests`);
  console.log(`�� Endpoint: ${CONFIG.BASE_URL}${CONFIG.ENDPOINT}`);
  console.log('=' * 60);
  
  stats.startTime = Date.now();
  
  // Create user IDs from 1 to 1000
  const userIds = Array.from({ length: CONFIG.TOTAL_REQUESTS }, (_, i) => i + 1);
  
  // Split into batches
  const batches = [];
  for (let i = 0; i < userIds.length; i += CONFIG.CONCURRENT_REQUESTS) {
    batches.push(userIds.slice(i, i + CONFIG.CONCURRENT_REQUESTS));
  }
  
  // Process batches
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    
    console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} requests)`);
    
    await runBatch(batchIndex, batch);
    
    // Small delay between batches
    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  stats.endTime = Date.now();
  generateReport();
}

// Function to generate detailed report
function generateReport() {
  const totalTime = stats.endTime - stats.startTime;
  const avgResponseTime = stats.responseTimes.length > 0 
    ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length 
    : 0;
  
  const sortedTimes = stats.responseTimes.sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  
  const report = {
    summary: {
      totalRequests: stats.total,
      successfulRequests: stats.success,
      failedRequests: stats.failed,
      successRate: `${((stats.success / stats.total) * 100).toFixed(2)}%`,
      totalTime: `${totalTime}ms`,
      requestsPerSecond: `${(stats.total / (totalTime / 1000)).toFixed(2)}`,
      concurrentRequests: CONFIG.CONCURRENT_REQUESTS
    },
    responseTime: {
      average: `${avgResponseTime.toFixed(2)}ms`,
      minimum: `${Math.min(...stats.responseTimes)}ms`,
      maximum: `${Math.max(...stats.responseTimes)}ms`,
      p50: `${p50}ms`,
      p90: `${p90}ms`,
      p95: `${p95}ms`,
      p99: `${p99}ms`
    },
    errors: stats.errors,
    successfulBookings: stats.successfulBookings.slice(0, 10)
  };
  
  // Console output
  console.log('\n' + '=' * 60);
  console.log('📊 LOAD TEST REPORT');
  console.log('=' * 60);
  console.log(`Total Requests: ${report.summary.totalRequests}`);
  console.log(`Successful: ${report.summary.successfulRequests}`);
  console.log(`Failed: ${report.summary.failedRequests}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log(`Total Time: ${report.summary.totalTime}`);
  console.log(`Requests/Second: ${report.summary.requestsPerSecond}`);
  
  console.log('\n⏱️  RESPONSE TIMES');
  console.log(`Average: ${report.responseTime.average}`);
  console.log(`Min: ${report.responseTime.minimum}`);
  console.log(`Max: ${report.responseTime.maximum}`);
  console.log(`P50: ${report.responseTime.p50}`);
  console.log(`P90: ${report.responseTime.p90}`);
  console.log(`P95: ${report.responseTime.p95}`);
  console.log(`P99: ${report.responseTime.p99}`);
  
  if (Object.keys(report.errors).length > 0) {
    console.log('\n❌ ERRORS');
    Object.entries(report.errors).forEach(([error, count]) => {
      console.log(`${error}: ${count}`);
    });
  }
  
  // Save report to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `load-test-1000-${timestamp}.json`;
  const RESULTS_DIR = path.join(__dirname, 'result');
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  const reportPath = path.join(RESULTS_DIR, reportFile);
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Report saved to: ${reportFile}`);
  
  // Save successful bookings
  if (stats.successfulBookings.length > 0) {
    const bookingsFile = `successful-bookings-1000-${timestamp}.json`;
    const bookingsPath = path.join(RESULTS_DIR, bookingsFile);
    fs.writeFileSync(bookingsPath, JSON.stringify(stats.successfulBookings, null, 2));
    console.log(`💾 Successful bookings saved to: ${bookingsFile}`);
  }
  
  // Performance analysis
  console.log('\n🔍 PERFORMANCE ANALYSIS');
  if (parseFloat(report.summary.requestsPerSecond) < 100) {
    console.log('⚠️  Low throughput detected - possible bottlenecks:');
    console.log('   - Database connection pool');
    console.log('   - Redis connection');
    console.log('   - RabbitMQ queue processing');
    console.log('   - CPU/Memory resources');
  } else if (parseFloat(report.summary.requestsPerSecond) > 500) {
    console.log('✅ Good throughput achieved!');
  }
  
  if (parseFloat(report.responseTime.average) > 5000) {
    console.log('⚠️  High response times detected - check:');
    console.log('   - Database query performance');
    console.log('   - Network latency');
    console.log('   - Queue processing speed');
  }
  
  if (parseFloat(report.summary.successRate) < 95) {
    console.log('⚠️  Low success rate - investigate errors above');
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the test
if (require.main === module) {
  runLoadTest().catch(console.error);
}

module.exports = { runLoadTest, makeBookingRequest };