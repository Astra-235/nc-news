const {
  convertTimestampToDate, createLookupTable
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupTable", ()=>{
  test("creates an object", ()=>{
    //arrange
    const arg1 = [{a:1, b:2, c:3}, {a:4, b:5, c:6}, {a:7, b:8, c:9}]
    const arg2 = 'a'
    const arg3 = 'b'

    //act
    const result = createLookupTable(arg1, arg2, arg3)

    //assert
    expect(typeof result).toBe('object')
  })
  test("returns an object, with the value specified by the second parameter is taken from each object in the input array and made into a key in the returned lookup object, with the corresponding value being taken from the property specified by the second parameter", ()=>{
    //arrange
    const arg1 = [{a:1, b:2, c:3}, {a:4, b:5, c:6}, {a:7, b:8, c:9}]
    const arg2 = 'a'
    const arg3 = 'b'

    //act
    const result = createLookupTable(arg1, arg2, arg3)
    console.log(result)
    //assert
    expect(result).toEqual({
      1:2,
      4:5,
      7:8
    })
  })
})

