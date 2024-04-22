export function valid(
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0]
): asserts condition {
  if (!condition) {
    throw new Response(body, {
      status: 400,
    });
  }
}

export function authorized(
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0]
): asserts condition {
  if (!condition) {
    throw new Response(body, {
      status: 401,
    });
  }
}

export function allowed(
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0]
): asserts condition {
  if (!condition) {
    throw new Response(body, {
      status: 403,
    });
  }
}

export function found(
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0]
): asserts condition {
  if (!condition) {
    throw new Response(body, {
      status: 404,
    });
  }
}
