import { NextEventPipe } from './next-event.pipe';

describe('NextEventPipe', () => {
  it('create an instance', () => {
    const pipe = new NextEventPipe();
    expect(pipe).toBeTruthy();
  });
});
