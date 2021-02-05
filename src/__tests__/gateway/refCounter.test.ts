import RefCounter from '../../refCounter';

// Get a promise that can be externally resolved.
const resolvable = (): [() => void, Promise<void>] => {
  let resolve = () => {};
  let prom = new Promise<void>((res) => (resolve = res));
  return [resolve, prom];
};

describe('RefCounter', () => {
  it('should produce the contained value', () => {
    const data = {};
    let destruct = jest.fn();
    let called = false;
    new RefCounter(data, destruct).withBorrow((borrowed) => {
      called = true;
      expect(borrowed).toBe(data);
    });
    expect(called).toBeTruthy();
  });

  it('should release if immediately cleaned up', () => {
    let destruct = jest.fn();
    const data = {};
    const counter = new RefCounter(data, destruct);
    counter.cleanupWhenReady();
    expect(destruct).toBeCalledWith(data);
  });

  it('should prevent access after the value has been destructed', () => {
    let destruct = jest.fn();
    const data = {};
    const counter = new RefCounter(data, destruct);
    counter.cleanupWhenReady();
    expect(destruct).toBeCalledWith(data);
    expect(() =>
      counter.withBorrow(() => {}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Cannot borrow a destructed value."`,
    );
  });

  it('should wait to cleanupWhenReady until usage has resolved', async () => {
    let destruct = jest.fn();
    const data = {};
    const counter = new RefCounter(data, destruct);

    const [resolve, prom] = resolvable();
    const useProm = counter.withBorrow(() => prom);

    counter.cleanupWhenReady();
    expect(destruct).not.toBeCalled();

    resolve();
    await useProm;

    expect(destruct).toBeCalledWith(data);
  });

  it('should wait to cleanupWhenReady until all usages have resolved (complex)', async () => {
    let destruct = jest.fn();
    const data = {};
    const counter = new RefCounter(data, destruct);

    const [resolve, prom] = resolvable();
    const [resolve1, prom1] = resolvable();
    const [resolve2, prom2] = resolvable();
    const [resolve3, prom3] = resolvable();
    const use = counter.withBorrow(() => prom);
    const use1 = counter.withBorrow(() => prom1);
    const use2 = counter.withBorrow(() => prom2);
    const use3 = counter.withBorrow(() => prom3);

    counter.cleanupWhenReady();
    expect(destruct).not.toBeCalled();

    resolve();
    await use;

    expect(destruct).not.toBeCalled();

    resolve1();
    resolve2();
    await use1;
    await use2;

    expect(destruct).not.toBeCalled();

    // Here we have a hand-off -- another borrow is created before the
    // current borrow is resolved.
    const [resolve4, prom4] = resolvable();
    const use4 = counter.withBorrow(() => prom4);

    resolve3();
    await use3;

    expect(destruct).not.toBeCalled();

    resolve4();
    await use4;

    expect(destruct).toBeCalledWith(data);
  });
});
