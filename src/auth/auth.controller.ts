import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() registerDto: RegisterDto) {
        return this.authService.signup(registerDto);
    }

    @Post('signin')
    signin(@Body() loginDto: LoginDto) {
        return this.authService.signin(loginDto);
    }
}