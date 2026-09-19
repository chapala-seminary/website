// Pages Functions adapter. The handler is a plain fetch handler with no
// Pages-specific anything, so moving to a Worker with static assets later is
// a deploy change rather than a rewrite.
import { handle } from '../../worker/api.js';
export const onRequest = (ctx) => handle(ctx.request, ctx.env);
