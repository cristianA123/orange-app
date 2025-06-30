import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedRpcException } from '../exceptions/unauthorized.rpc-exception';
import { NotFoundRpcException } from '../exceptions/not-found.rpc-exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw NotFoundRpcException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw UnauthorizedRpcException();

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.getUserById(payload.sub);
      if (!user) throw UnauthorizedRpcException();

      return this.generateTokens(user);
    } catch (err) {
      throw UnauthorizedRpcException();
    }
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
