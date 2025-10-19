export const validUser = { email: 'solina.n+8899@flipside.team', password: 'Password@1' } as const;
export const invalidUser = { email: 'bad@example.com', password: 'wrong' } as const;

export function generateNewUser(ts: number = Date.now()) {
  return {
    name: `Test User ${ts}`,
    email: `user+${ts}@example.com`,
    password: 'pass1234',
  } as const;
}
