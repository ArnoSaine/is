type HttpResponseAssertion = (
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0]
) => asserts condition;

function createHttpResponseAssertion(status: number): HttpResponseAssertion {
  return function (
    condition: unknown,
    body?: ConstructorParameters<typeof Response>[0]
  ): asserts condition {
    if (!condition) {
      throw new Response(body, {
        status,
      });
    }
  };
}

export const valid: HttpResponseAssertion = createHttpResponseAssertion(400);
export const authorized: HttpResponseAssertion =
  createHttpResponseAssertion(401);
export const allowed: HttpResponseAssertion = createHttpResponseAssertion(403);
export const found: HttpResponseAssertion = createHttpResponseAssertion(404);
