require('dotenv').config()
const FileSystemCache = require('../lib/Infrastructure/Cache/FileSystem')
const {expect} = require('chai')

const key = '1234'

describe('File System Cache', function () {

  after(async function () {
    await FileSystemCache.remove(key)
  })
  it('should get item by sent mail and recipient', async function () {
    this.timeout(5000)

    const data = 'test data';

    const result = await FileSystemCache.get(key);
    expect(result).to.equal(false);

    await FileSystemCache.set(key, data);

    const result2 = await FileSystemCache.get(key);
    expect(result2).to.equal(data)

  })

})