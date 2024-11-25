import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
} from './dto/create-auth.dto';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('admin/token')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('token')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    const user = req.user;
    return user;
  }
}
