import { andThen, err, isErr, isOk, mapResult, ok, unwrapOr } from '../result';

describe('result helpers', () => {
  it('creates ok/err and narrows correctly', () => {
    const good = ok(42);
    const bad = err('fail');

    expect(isOk(good)).toBe(true);
    expect(isErr(good)).toBe(false);
    expect(isOk(bad)).toBe(false);
    expect(isErr(bad)).toBe(true);
  });

  it('maps ok values and preserves err', () => {
    const good = mapResult(ok(2), (n) => n * 2);
    const bad = mapResult(err('fail'), (n: number) => n * 2);

    expect(good).toEqual(ok(4));
    expect(bad).toEqual(err('fail'));
  });

  it('andThen chains ok values and short-circuits errors', () => {
    const double = (n: number) => ok(n * 2);
    const fail = () => err('nope');

    expect(andThen(ok(3), double)).toEqual(ok(6));
    expect(andThen(err('fail'), double)).toEqual(err('fail'));
    expect(andThen(ok(3), fail)).toEqual(err('nope'));
  });

  it('unwrapOr returns fallback on err', () => {
    expect(unwrapOr(ok('a'), 'fallback')).toBe('a');
    expect(unwrapOr(err('fail'), 'fallback')).toBe('fallback');
  });
});
