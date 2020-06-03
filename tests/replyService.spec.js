require('dotenv').config();
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const ReplyService = require('../lib/Services/Replies/ReplyService');
const FileSystemCache = require('../lib/Infrastructure/Cache/FileSystem');
const {expect} = require('chai');

const testUserId = "5d96cfd964b7210478a57407";

describe('Reply Service', function() {
  after(async function () {
    await mongoose.disconnect(); // 410184
    //await FileSystemCache.set(testUserId, "406582");
    await FileSystemCache.set(testUserId, "410184");
  });
  it('should get replies by provided user id', async function() {
    this.timeout(35000);
    const mails = await ReplyService.getReplies(testUserId);
    console.log(mails);
  });
});