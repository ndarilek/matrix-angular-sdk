describe('RecentsService', function() {
    var scope;
    var MSG_EVENT = "__test__";
    
    var testEventContainsBingWord, testIsLive, testEvent, testDocumentTitle;
    
    var eventHandlerService = {
        MSG_EVENT: MSG_EVENT,
        eventContainsBingWord: function(event) {
            return testEventContainsBingWord;
        }
    };
    
    var doc = [
        { title: testDocumentTitle }
    ];

    // setup the service and mocked dependencies
    beforeEach(function() {
        
        // set default mock values
        testDocumentTitle = "some title";
        testEventContainsBingWord = false;
        testIsLive = true;
        testEvent = {
            content: {
                body: "Hello world",
                msgtype: "m.text"
            },
            user_id: "@alfred:localhost",
            room_id: "!fl1bb13:localhost",
            event_id: "fwuegfw@localhost"
        }
        
        // mocked dependencies
        module(function ($provide) {
          $provide.value('eventHandlerService', eventHandlerService);
          $provide.value('$document', doc);
        });
        
        // tested service
        module('recentsService');
    });
    
    beforeEach(inject(function($rootScope) {
        scope = $rootScope;
    }));

    it('should start with no unread messages.', inject(
    function(recentsService) {
        expect(recentsService.getUnreadMessages()).toEqual({});
        expect(recentsService.getUnreadBingMessages()).toEqual({});
    }));
    
    it('should NOT add an unread message to the room currently selected.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId(testEvent.room_id);
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        expect(recentsService.getUnreadMessages()).toEqual({});
        expect(recentsService.getUnreadBingMessages()).toEqual({});
    }));
    
    it('should add an unread message to the room NOT currently selected.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        
        var unread = {};
        unread[testEvent.room_id] = 1;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
    }));
    
    it('should add an unread message and an unread bing message if a message contains a bing word.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        testEventContainsBingWord = true;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        
        var unread = {};
        unread[testEvent.room_id] = 1;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
        
        var bing = {};
        bing[testEvent.room_id] = testEvent;
        expect(recentsService.getUnreadBingMessages()).toEqual(bing);
    }));
    
    it('should clear both unread and unread bing messages when markAsRead is called.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        testEventContainsBingWord = true;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        
        var unread = {};
        unread[testEvent.room_id] = 1;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
        
        var bing = {};
        bing[testEvent.room_id] = testEvent;
        expect(recentsService.getUnreadBingMessages()).toEqual(bing);
        
        recentsService.markAsRead(testEvent.room_id);
        
        unread[testEvent.room_id] = 0;
        bing[testEvent.room_id] = undefined;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
        expect(recentsService.getUnreadBingMessages()).toEqual(bing);
    }));
    
    it('should not add messages as unread if they are not live.', inject(
    function(recentsService) {
        testIsLive = false;
        
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        testEventContainsBingWord = true;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
    
        expect(recentsService.getUnreadMessages()).toEqual({});
        expect(recentsService.getUnreadBingMessages()).toEqual({});
    }));
    
    it('should increment the unread message count.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
    
        var unread = {};
        unread[testEvent.room_id] = 1;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
        
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        
        unread[testEvent.room_id] = 2;
        expect(recentsService.getUnreadMessages()).toEqual(unread);
    }));
    
    it('should set the bing event to the latest message to contain a bing word.', inject(
    function(recentsService) {
        recentsService.setSelectedRoomId("!someotherroomid:localhost");
        testEventContainsBingWord = true;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
    
        var nextEvent = angular.copy(testEvent);
        nextEvent.content.body = "Goodbye cruel world.";
        nextEvent.event_id = "erfuerhfeaaaa@localhost";
        scope.$broadcast(MSG_EVENT, nextEvent, testIsLive);
        
        var bing = {};
        bing[testEvent.room_id] = nextEvent;
        expect(recentsService.getUnreadBingMessages()).toEqual(bing);
    }));
    
    it('should do nothing when marking an unknown room ID as read.', inject(
    function(recentsService) {
        recentsService.markAsRead("!someotherroomid:localhost");
        expect(recentsService.getUnreadMessages()).toEqual({});
        expect(recentsService.getUnreadBingMessages()).toEqual({});
    }));
    
    it('should update the title with the number of unread messages.', inject(
    function(recentsService) {
        var oldTitle = doc[0].title;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        expect(doc[0].title).not.toEqual(oldTitle);
    }));
    
    it('should reset the title if there are no unread messages.', inject(
    function(recentsService) {
        var oldTitle = doc[0].title;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        expect(doc[0].title).not.toEqual(oldTitle);
        recentsService.markAsRead(testEvent.room_id);
        expect(doc[0].title).toEqual(oldTitle);
    }));
    
    it('should not adjust the title if it is not enabled.', inject(
    function(recentsService) {
        recentsService.showUnreadMessagesInTitle(false);
        var oldTitle = doc[0].title;
        scope.$broadcast(MSG_EVENT, testEvent, testIsLive);
        expect(doc[0].title).toEqual(oldTitle);
    }));
});
