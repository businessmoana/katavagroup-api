import { Module } from '@nestjs/common';
import { PortalService } from './portal.service';
import { PortalController } from './portal.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocationsService } from 'src/locations/locations.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_secret_key', // Use a strong secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [
    PortalController
  ],
  providers: [PortalService,LocationsService],
})
export class PortalModule { }
