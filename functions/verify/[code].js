import { handle } from '../../worker/api.js';
export const onRequest = (ctx) => handle(ctx.request, ctx.env);
