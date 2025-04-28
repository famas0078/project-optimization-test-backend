import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a new instance of the JWT authentication strategy.
   *
   * This method is called when the strategy is registered in the application.
   * It sets up the configuration for the strategy, including the secret or
   * public key, the algorithm to use for verification, and the source of the
   * JWT token.
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
   * Validates the payload of the JWT token.
   *
   * This method is called when the JWT token is presented to the server.
   * It checks the validity of the token type and retrieves the user object
   * from the database if the payload is valid.
   *
   * @param payload - The payload of the JWT token, containing the subject and token type.
   * @returns The user object if the payload is valid.
   * @throws UnauthorizedException if the token type is invalid or the user is not found.
   */
  async validate(payload: {
    sub: number;
    tokenType: 'access' | 'refresh' | 'magic';
  }): Promise<any> {
    // Ensure the token type is 'access'
    if (payload.tokenType !== 'access') {
      // Throw an error if the token type is not 'access'
      throw new UnauthorizedException('Invalid token type');
    }

    // Attempt to find the user by ID in the database
    const user = await User.findOne({
      where: { id: payload.sub },
      relations: {
        organization: true, // Include the organization relation
        role: true, // Include the role relation
      },
    });

    // Throw an error if the user is not found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Destructure to exclude the password from the returned user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
