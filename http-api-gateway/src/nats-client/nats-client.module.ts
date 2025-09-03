// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule,
//     ClientsModule.registerAsync([
//       {
//         name: 'NATS_SERVICE',
//         imports: [ConfigModule],
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => ({
//           transport: Transport.NATS,
//           options: {
//             servers: [configService.get<string>('nats.host')],
//           },
//         }),
//       },
//     ]),
//   ],
//   exports: [ClientsModule],
// })
// export class NatsClientModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('nats.host')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsClientModule {}
