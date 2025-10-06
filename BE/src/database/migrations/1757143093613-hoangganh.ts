import { MigrationInterface, QueryRunner } from "typeorm";

export class Hoangganh1757143093613 implements MigrationInterface {
    name = 'Hoangganh1757143093613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(255) NULL, \`display_name\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`route_code\` varchar(255) NULL, \`path\` varchar(255) NULL, \`method\` varchar(255) NULL, \`display_name\` varchar(255) NULL, UNIQUE INDEX \`IDX_a22f91f82ebcd348b232bcc607\` (\`route_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`permission_id\` int NOT NULL, \`role_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`slug\` varchar(50) NOT NULL, \`name\` varchar(120) NOT NULL, UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, \`order_id\` int NULL, \`amount\` decimal(12,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'VND', \`provider\` varchar(40) NOT NULL, \`method\` enum ('card', 'ewallet', 'bank_transfer', 'qr') NOT NULL, \`status\` enum ('pending', 'succeeded', 'failed', 'cancelled', 'refunded', 'completed') NOT NULL DEFAULT 'pending', \`transaction_id\` varchar(100) NULL, \`failure_msg\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(120) NOT NULL, \`price\` decimal(12,2) NOT NULL DEFAULT '0.00', \`total_ticket\` int NOT NULL, \`min_ticket\` int NOT NULL DEFAULT '1', \`max_ticket\` int NOT NULL DEFAULT '10', \`show_id\` int NOT NULL, \`description\` varchar(250) NULL, \`thumbnail\` varchar(250) NULL, \`slug\` varchar(50) NULL, \`start_time\` datetime NULL, \`end_time\` datetime NULL, \`is_free\` tinyint NULL, UNIQUE INDEX \`IDX_c635ea3f47267dbf3e1b17be25\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`ticket_id\` int NOT NULL, \`show_id\` int NOT NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(12,2) NOT NULL, \`total_price\` decimal(12,2) NOT NULL, \`discount_amount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`final_price\` decimal(12,2) NOT NULL, \`special_requests\` varchar(255) NULL, \`seat_id\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_number\` varchar(30) NULL, \`user_id\` int NOT NULL, \`event_id\` int NOT NULL, \`phone\` varchar(30) NULL, \`status\` enum ('pending', 'paid', 'confirmed', 'cancelled', 'expired', 'refunded', 'failed') NOT NULL DEFAULT 'pending', \`total_amount\` decimal(12,2) NOT NULL, \`discount_amount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`final_amount\` decimal(12,2) NOT NULL, \`email\` varchar(255) NULL, \`province\` varchar(255) NULL, \`district\` varchar(255) NULL, \`ward\` varchar(255) NULL, \`street\` varchar(255) NULL, \`address\` varchar(255) NULL, \`note\` varchar(255) NULL, \`idempotency_key\` varchar(255) NULL, \`expires_at\` timestamp NULL, UNIQUE INDEX \`IDX_59d6b7756aeb6cbb43a093d15a\` (\`idempotency_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_role_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_role_id\` int NOT NULL, \`permission_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(50) NOT NULL, \`display_name\` varchar(255) NULL, UNIQUE INDEX \`IDX_3917871d332634bb3b0e62ff99\` (\`code\`), UNIQUE INDEX \`IDX_9e0cdc4e699fcc0612b1a12166\` (\`display_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_memberships\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, \`event_id\` int NOT NULL, \`event_role_id\` int NOT NULL, \`joined_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(30) NULL, \`slug\` varchar(50) NULL, \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`role_id\` int NOT NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`date_of_birth\` date NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_bc0c27d77ee64f0a097a5c269b\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` int NOT NULL, \`type\` enum ('public', 'private_link') NOT NULL DEFAULT 'public', \`message\` varchar(255) NULL, \`link\` varchar(255) NULL, \`url\` varchar(255) NULL, \`slug\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` int NOT NULL, \`account_name\` varchar(255) NOT NULL, \`account_number\` varchar(255) NOT NULL, \`bank_name\` varchar(255) NOT NULL, \`local_branch\` varchar(255) NULL, \`business_type\` enum ('personal', 'company') NOT NULL DEFAULT 'personal', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(120) NOT NULL, \`description\` text NULL, \`thumbnail\` varchar(250) NULL, \`banner\` varchar(250) NULL, \`slug\` varchar(50) NOT NULL, \`type\` enum ('offline', 'online') NOT NULL, \`status\` enum ('draft', 'pending', 'approved', 'rejected') NOT NULL DEFAULT 'draft', \`name_address\` varchar(255) NULL, \`province\` varchar(255) NULL, \`district\` varchar(255) NULL, \`ward\` varchar(255) NULL, \`street\` varchar(255) NULL, \`category_id\` int NOT NULL, \`created_by\` int NOT NULL, \`org_name\` varchar(255) NULL, \`org_description\` varchar(255) NULL, \`org_thumbnail\` varchar(255) NULL, \`venue_type\` enum ('indoor', 'outdoor') NOT NULL DEFAULT 'outdoor', \`is_special\` tinyint NOT NULL DEFAULT 0, \`is_trending\` tinyint NOT NULL DEFAULT 0, \`videoUrl\` varchar(250) NULL, UNIQUE INDEX \`IDX_05bd884c03d3f424e2204bd14c\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shows\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` int NOT NULL, \`time_start\` timestamp NOT NULL, \`time_end\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`seats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`seat_code\` varchar(4) NOT NULL, \`zone\` varchar(50) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`show_seats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`show_id\` int NOT NULL, \`seat_id\` int NOT NULL, \`status\` enum ('available', 'selected', 'booked') NOT NULL, \`reserved_by_user_id\` int NULL, \`reserved_at\` datetime NULL, \`reserved_until\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`showId\` int NULL, \`seatId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_3eb2fe2bf4c1d096d224bfe8e4d\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_8b96e1d08d00d10f645b8d2f952\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_427785468fb7d2733f59e7d7d39\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_b2f7b823a21562eeca20e72b006\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_81fa3650935b12f80f7968fd0cf\` FOREIGN KEY (\`show_id\`) REFERENCES \`shows\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_14d6d26343634ee91fb9cf486ba\` FOREIGN KEY (\`ticket_id\`) REFERENCES \`tickets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_8b29bfedc90b332c5a1ae69dd16\` FOREIGN KEY (\`show_id\`) REFERENCES \`shows\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_642ca308ac51fea8327e593b8ab\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_role_permissions\` ADD CONSTRAINT \`FK_e8d4deb508773852aee561337c9\` FOREIGN KEY (\`event_role_id\`) REFERENCES \`event_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` ADD CONSTRAINT \`FK_02ef511b12992ff3a969b3905d0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` ADD CONSTRAINT \`FK_dd855a362bfd8662c1fb4aa5380\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` ADD CONSTRAINT \`FK_318aabc5dbc74da9c8600f7737e\` FOREIGN KEY (\`event_role_id\`) REFERENCES \`event_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`settings\` ADD CONSTRAINT \`FK_d4001cbeef50f7c8a4344fdfbb5\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_event\` ADD CONSTRAINT \`FK_5cabd564cf6573469cdadc3f964\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_643188b30e049632f80367be4e1\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_1a259861a2ce114f074b366eed2\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shows\` ADD CONSTRAINT \`FK_c666928e39f01d397b1213021be\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`show_seats\` ADD CONSTRAINT \`FK_dfbf20f8114a38b83f3db4adc20\` FOREIGN KEY (\`showId\`) REFERENCES \`shows\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`show_seats\` ADD CONSTRAINT \`FK_541d5e75fe55df94a3aa41a10a1\` FOREIGN KEY (\`seatId\`) REFERENCES \`seats\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`show_seats\` DROP FOREIGN KEY \`FK_541d5e75fe55df94a3aa41a10a1\``);
        await queryRunner.query(`ALTER TABLE \`show_seats\` DROP FOREIGN KEY \`FK_dfbf20f8114a38b83f3db4adc20\``);
        await queryRunner.query(`ALTER TABLE \`shows\` DROP FOREIGN KEY \`FK_c666928e39f01d397b1213021be\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_1a259861a2ce114f074b366eed2\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_643188b30e049632f80367be4e1\``);
        await queryRunner.query(`ALTER TABLE \`payment_event\` DROP FOREIGN KEY \`FK_5cabd564cf6573469cdadc3f964\``);
        await queryRunner.query(`ALTER TABLE \`settings\` DROP FOREIGN KEY \`FK_d4001cbeef50f7c8a4344fdfbb5\``);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` DROP FOREIGN KEY \`FK_318aabc5dbc74da9c8600f7737e\``);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` DROP FOREIGN KEY \`FK_dd855a362bfd8662c1fb4aa5380\``);
        await queryRunner.query(`ALTER TABLE \`event_memberships\` DROP FOREIGN KEY \`FK_02ef511b12992ff3a969b3905d0\``);
        await queryRunner.query(`ALTER TABLE \`event_role_permissions\` DROP FOREIGN KEY \`FK_e8d4deb508773852aee561337c9\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_642ca308ac51fea8327e593b8ab\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_8b29bfedc90b332c5a1ae69dd16\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_14d6d26343634ee91fb9cf486ba\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_81fa3650935b12f80f7968fd0cf\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_b2f7b823a21562eeca20e72b006\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_427785468fb7d2733f59e7d7d39\``);
        await queryRunner.query(`ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_8b96e1d08d00d10f645b8d2f952\``);
        await queryRunner.query(`ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_3eb2fe2bf4c1d096d224bfe8e4d\``);
        await queryRunner.query(`DROP TABLE \`show_seats\``);
        await queryRunner.query(`DROP TABLE \`seats\``);
        await queryRunner.query(`DROP TABLE \`shows\``);
        await queryRunner.query(`DROP INDEX \`IDX_05bd884c03d3f424e2204bd14c\` ON \`events\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP TABLE \`payment_event\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc0c27d77ee64f0a097a5c269b\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`event_memberships\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e0cdc4e699fcc0612b1a12166\` ON \`event_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_3917871d332634bb3b0e62ff99\` ON \`event_roles\``);
        await queryRunner.query(`DROP TABLE \`event_roles\``);
        await queryRunner.query(`DROP TABLE \`event_role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_59d6b7756aeb6cbb43a093d15a\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_c635ea3f47267dbf3e1b17be25\` ON \`tickets\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`user_role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_a22f91f82ebcd348b232bcc607\` ON \`permissions\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
