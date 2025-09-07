import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedRpcException } from '../exceptions/unauthorized.rpc-exception';
import { NotFoundRpcException } from '../exceptions/not-found.rpc-exception';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByEmail(email: string, password: string) {
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
      if (!user.data) throw UnauthorizedRpcException();

      return this.generateTokens(user.data);
    } catch (err) {
      throw UnauthorizedRpcException();
    }
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      instituteId: user.institute_id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2d',
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
        rol: user.rol,
        instituteId: user.institute_id,
      },
    };
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || '123456',
      });

      const user = {
        id: payload.sub,
        email: payload.email,
        instituteId: payload.instituteId,
      };

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '2d' },
      );

      return {
        user,
        token: newAccessToken,
      };
    } catch (err) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token',
      });
    }
  }
}
