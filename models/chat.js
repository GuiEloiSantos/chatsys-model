var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chat = new Schema(
    {
        company_id: {type: Schema.Types.ObjectId, ref: 'company_id' },
        chat_id: {type: String, unique:true, index: true},
        status: { type: String, default:"Chat"},
        transcript: {type:String},
        date: {type: Date}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

chat.static({
    newChat: function (company_id, chat_id, status, date, transcript) {
        var Chat = this.model('Chat');
        var chat = new Chat();

        chat.set({
            company_id: company_id,
            chat_id: chat_id,
            status: status,
            date: date,
            transcript: transcript
        });
        return chat.save();
    },
    getChatByCompany: function (company_id) {
        var Chat = this.model('Chat');
        return Chat.find({'company_id':company_id});
    },
    getChatByChatId: function (chat_id) {
        var Chat = this.model('Chat');
        return Chat.findOne({'chat_id':chat_id});
    },
    modifyStatus: function (id,status) {
        var Chat = this.model('Chat');
        Chat.findOne({_id: id}).exec().then(function (chat) {
            return chat.update({
                status: status
            });
        });
    },
    setTranscript: function (id,transcript) {
        var Chat = this.model('Chat');
        Chat.findOne({_id: id}).exec().then(function (chat) {
            return chat.update({
                transcript: transcript
            });
        });
    }
});



module.exports = mongoose.model('Chat', chat);