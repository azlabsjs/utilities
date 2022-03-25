export function assertRequiredArgs(required: number, list: IArguments): void {
  if (list.length < required) {
    throw new TypeError(
      `${required} argument${required > 1 ? 's ' : ' '}required, but ${
        list.length === 0 ? 'none ' : `${list.length} `
      }received`
    );
  }
}
