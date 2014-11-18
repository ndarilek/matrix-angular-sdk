Matrix Angular SDK
==================
This project provides AngularJS services for implementing the [Client-Server API] 
on [Matrix]: an open standard for interoperable Instant Messaging and VoIP. It 
comes shipped with [Synapse] : a home server reference implementation.

This project also provides a complete, stand-alone client which can communicate 
with Matrix home servers using a web browser.

Overview
========
The ``app`` directory contains the SDK, which is split up into subfolders depending
on the logical scope of the code. The ``components`` directory contains reusable
components which are used in many places. More specific directories such as ``home``
and ``settings`` contain code specific to that part of the app: e.g. the home screen
and settings page respectively.

The [Client-Server API] is encapsulated as an AngularJS service called ``matrixService``.
There are also complementary services such as ``eventStreamService`` which handle more
complex non-HTTP client logic.

Usage
=====
Services can be used independently provided their dependencies are satisfied. 
 * ``matrixService`` is provided at the lowest level, as it just wraps the raw HTTP calls.
 * ``modelService`` allows models of matrix objects to be accessed, such as ``User``, 
``Room``, ``RoomState`` and ``RoomMember``, and provides convenience functions to perform
HTTP calls on these objects (e.g. ``Room.leave``).
 * ``eventHandlerService`` interprets raw Matrix events and determines what needs to be
 stored with the ``modelService``.
 * ``eventStreamService`` controls long-polling behaviour on the ``/events`` HTTP call.
 
Alternatively, you can use different controllers and html templates and leave the services
to work together as is.

Tests
=====
Tests are contained in the [test directory](syweb/webclient/test). They require
Karma (running PhantomJS) and Jasmine 2.x+ in order to run. Assuming you have the 
required karma plugins, you can run the tests by running ``karma start`` in the 
test directory.

[Synapse]: https://github.com/matrix-org/synapse/
[Matrix]: http://www.matrix.org
[Client-Server API]: http://matrix.org/docs/api/client-server/