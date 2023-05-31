export async function parseBody(event: any) {
  let body: any = await readBody(event);

  if (body instanceof Uint8Array) {
    body = JSON.parse(new TextDecoder().decode(body));
  }

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Request Body",
    });
  }

  return body as Record<string, any>;
}
