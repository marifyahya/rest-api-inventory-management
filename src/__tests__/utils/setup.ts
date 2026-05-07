jest.mock("../../utils/date.util", () => ({
  withLocalTime: (data: unknown) => data,
}));
