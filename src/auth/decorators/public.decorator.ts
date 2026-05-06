import { SetMetadata } from "@nestjs/common";

// metadata key the guard will look for is IS_PUBLIC-KEY
export const IS_PUBLIC_KEY = 'isPublic';

//@Public() is the deco you put on any route that doesn't need a token
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
