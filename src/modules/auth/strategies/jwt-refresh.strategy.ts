import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  /**
   * Constructs a new instance of the JWT refresh strategy.
   *
   * This method sets up the configuration for the strategy, including the
   * source of the JWT token, whether to ignore expiration, the secret or
   * public key for verification, and the verification algorithm.
   */
  constructor() {
    super({
      /**
       * The source of the JWT token.
       *
       * This is a function that takes in a request and returns the JWT token
       * from the request. The default implementation is to extract the token
       * from the Authorization header, which is the standard location for
       * JWT tokens.
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /**
       * Whether to ignore the expiration of the token.
       *
       * If this is set to true, the strategy will not check the expiration of
       * the token. This is useful for testing, but should be set to false in
       * production.
       */
      ignoreExpiration: false,
      /**
       * The secret or public key to use for verification.
       *
       * This is a string that contains the secret or public key to use for
       * verification. It is used to sign the JWT tokens.
       */
      secretOrKey: fs.readFileSync('config/keys/jwtKey.pub.pem').toString(),
      /**
       * The algorithm to use for verification.
       *
       * This is an array of strings that specifies the algorithm to use for
       * verification. The default implementation is to use the RS256 algorithm.
       */
      algorithms: ['RS256'],
    });
  }

  /**
   * Validate the payload of the JWT refresh token.
   *
   * This method is called when the JWT refresh token is presented to the server.
   * The payload of the token is validated and the user object is returned if the
   * payload is valid.
   *
   * @param payload the payload of the JWT refresh token.
   * @returns the user object if the payload is valid, otherwise an error is thrown.
   */
  async validate(payload: {
    sub: number;
    tokenType: 'access' | 'refresh' | 'magic';
  }): Promise<any> {
    // Check if the token type is not access
    if (payload.tokenType !== 'refresh') {
      // If the token type is not access, throw an UnauthorizedException
      throw new UnauthorizedException('Invalid token type');
    }

    // Find the user in the database where the id matches the sub in the payload
    const user = await User.findOne({
      where: { id: payload.sub },
      relations: {
        organization: true, // Include the organization relation
        role: true, // Include the role relation
      },
    });

    // If the user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return the user object without the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
