
//testinit

/**
 * Returns an array of elements with the given IDs
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
    var r = [],
        i = 0;

    for ( ; i < arguments.length; i++ ) {
        r.push( document.getElementById( arguments[i] ) );
    }
    return r;
}

/**
 * Asserts that a select matches the given IDs
 * @param {String} a - Assertion name
 * @param {String} b - Sizzle selector
 * @param {String} c - Array of ids to construct what is expected
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t( a, b, c ) {
    var f = Sizzle(b),
        s = "",
        i = 0;

    for ( ; i < f.length; i++ ) {
        s += ( s && "," ) + '"' + f[ i ].id + '"';
    }

    deepEqual(f, q.apply( q, c ), a + " (" + b + ")");
}

/**
 * Add random number to url to stop caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url( value ) {
    return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}


fireNative = document.createEvent ?
    function( node, type ) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent( type, true, true );
        node.dispatchEvent( event );
    } :
    function( node, type ) {
        var event = document.createEventObject();
        node.fireEvent( 'on' + type, event );
    };

function moduleTeardown(){}

module("baidu.sizzle", {teardown: moduleTeardown});
// #### NOTE: ####
// jQuery should not be used in this module
// except for DOM manipulation
// If jQuery is mandatory for the selection, move the test to jquery/test/unit/selector.js
// Use t() or Sizzle()
// ###############

/*
    ======== QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
        expect(numAssertions)
        stop()
        start()
            note: QUnit's eventual addition of an argument to stop/start is ignored in this test suite
            so that start and stop can be passed as callbacks without worrying about
                their parameters
    Test assertions:
        ok(value, [message])
        equal(actual, expected, [message])
        notEqual(actual, expected, [message])
        deepEqual(actual, expected, [message])
        notDeepEqual(actual, expected, [message])
        strictEqual(actual, expected, [message])
        notStrictEqual(actual, expected, [message])
        raises(block, [expected], [message])

    ======== testinit.js reference ========
    See data/testinit.js

    q(...);
        Returns an array of elements with the given IDs
        @example q("main", "foo", "bar") => [<div id="main">, <span id="foo">, <input id="bar">]

    t( testName, selector, [ "array", "of", "ids" ] );
        Asserts that a select matches the given IDs
        @example t("Check for something", "//[a]", ["foo", "baar"]);

    url( "some/url.php" );
        Add random number to url to stop caching
        @example url("data/test.html") => "data/test.html?10538358428943"
        @example url("data/test.php?foo=bar") => "data/test.php?foo=bar&10538358345554"
*/

test('prepareTest',function(){
    expect(1);
    stop();
    ua.importsrc('baidu.dom.appendTo,baidu.dom.removeAttr,baidu.dom.remove,baidu.dom.insertAfter,baidu.dom.prop,baidu.dom.contents,baidu.dom.text,baidu.dom.css,baidu.dom.height,baidu.dom.width,baidu.dom.html', function(){
        start();
        prepareTest();
        ok(true,'ok');
    }, "baidu.dom.appendTo");
});

test("element", function() {
    //expect( 37 );
    expect(35);

    equal( Sizzle("").length, 0, "Empty selector returns an empty array" );
    equal( Sizzle(" ").length, 0, "Empty selector returns an empty array" );
    equal( Sizzle("\t").length, 0, "Empty selector returns an empty array" );
    var form = document.getElementById("form");
    //ok( !Sizzle.matchesSelector( form, "" ), "Empty string passed to matchesSelector does not match" );
    ok( Sizzle("*").length > 30, "Select all" );
    var all = Sizzle("*"), good = true;
    for ( var i = 0; i < all.length; i++ ) {
        if ( all[i].nodeType == 8 ) {
            good = false;
        }
    }
    ok( good, "Select all elements, no comment nodes" );
    //t( "Element Selector", "html", ["html"] );
    t( "Element Selector", "body", ["body"] );
    t( "Element Selector", "#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );

    t( "Leading space", " #qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
    t( "Leading tab", "\t#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
    t( "Leading carriage return", "\r#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
    t( "Leading line feed", "\n#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
    t( "Leading form feed", "\f#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
    t( "Trailing space", "#qunit-fixture p ", ["firstp","ap","sndp","en","sap","first"] );
    t( "Trailing tab", "#qunit-fixture p\t", ["firstp","ap","sndp","en","sap","first"] );
    t( "Trailing carriage return", "#qunit-fixture p\r", ["firstp","ap","sndp","en","sap","first"] );
    t( "Trailing line feed", "#qunit-fixture p\n", ["firstp","ap","sndp","en","sap","first"] );
    t( "Trailing form feed", "#qunit-fixture p\f", ["firstp","ap","sndp","en","sap","first"] );

    t( "Parent Element", "dl ol", ["empty", "listWithTabIndex"] );
    t( "Parent Element (non-space descendant combinator)", "dl\tol", ["empty", "listWithTabIndex"] );
    var obj1 = document.getElementById("object1");
    equal( Sizzle("param", obj1).length, 2, "Object/param as context" );

    deepEqual( Sizzle("select", form), q("select1","select2","select3","select4","select5"), "Finding selects with a context." );

    // Check for unique-ness and sort order
    deepEqual( Sizzle("p, div p"), Sizzle("p"), "Check for duplicates: p, div p" );

    t( "Checking sort order", "h2, h1", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
    t( "Checking sort order", "h2:first, h1:first", ["qunit-header", "qunit-banner"] );
    t( "Checking sort order", "#qunit-fixture p, #qunit-fixture p a", ["firstp", "simon1", "ap", "google", "groups", "anchor1", "mark", "sndp", "en", "yahoo", "sap", "anchor2", "simon", "first"] );

    // Test Conflict ID
    var lengthtest = document.getElementById("lengthtest");
    deepEqual( Sizzle("#idTest", lengthtest), q("idTest"), "Finding element with id of ID." );
    deepEqual( Sizzle("[name='id']", lengthtest), q("idTest"), "Finding element with id of ID." );
    deepEqual( Sizzle("input[id='idTest']", lengthtest), q("idTest"), "Finding elements with id of ID." );

    var siblingTest = document.getElementById("siblingTest");
    deepEqual( Sizzle("div em", siblingTest), [], "Element-rooted QSA does not select based on document context" );
    deepEqual( Sizzle("div em, div em, div em:not(div em)", siblingTest), [], "Element-rooted QSA does not select based on document context" );
    deepEqual( Sizzle("div em, em\\,", siblingTest), [], "Escaped commas do not get treated with an id in element-rooted QSA" );

    var iframe = document.getElementById("iframe"),
        iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write("<body><p id='foo'>bar</p></body>");
    iframeDoc.close();
    deepEqual(
        Sizzle( "p:contains(bar)", iframeDoc ),
        [ iframeDoc.getElementById("foo") ],
        "Other document as context"
    );

    var html = "";
    for ( i = 0; i < 100; i++ ) {
        html = "<div>" + html + "</div>";
    }
    html = jQuery( html ).appendTo( document.body );
    ok( !!Sizzle("body div div div").length, "No stack or performance problems with large amounts of descendents" );
    ok( !!Sizzle("body>div div div").length, "No stack or performance problems with large amounts of descendents" );
    html.remove();

    // Real use case would be using .watch in browsers with window.watch (see Issue #157)
    q("qunit-fixture")[0].appendChild( document.createElement("toString") ).id = "toString";
    t( "Element name matches Object.prototype property", "toString#toString", ["toString"] );
});

// test("XML Document Selectors", function() {
//     var xml = createWithFriesXML();
//     expect( 10 );

//     equal( Sizzle("foo_bar", xml).length, 1, "Element Selector with underscore" );
//     equal( Sizzle(".component", xml).length, 1, "Class selector" );
//     equal( Sizzle("[class*=component]", xml).length, 1, "Attribute selector for class" );
//     equal( Sizzle("property[name=prop2]", xml).length, 1, "Attribute selector with name" );
//     equal( Sizzle("[name=prop2]", xml).length, 1, "Attribute selector with name" );
//     equal( Sizzle("#seite1", xml).length, 1, "Attribute selector with ID" );
//     equal( Sizzle("component#seite1", xml).length, 1, "Attribute selector with ID" );
//     equal( Sizzle.matches( "#seite1", Sizzle("component", xml) ).length, 1, "Attribute selector filter with ID" );
//     equal( Sizzle("meta property thing", xml).length, 2, "Descendent selector and dir caching" );
//     ok( Sizzle.matchesSelector( xml.lastChild, "soap\\:Envelope" ), "Check for namespaced element" );
// });

// test("broken", function() {
//     expect( 26 );

//     function broken( name, selector ) {
//         raises(function() {
//             // Setting context to null here somehow avoids QUnit's window.error handling
//             // making the e & e.message correct
//             // For whatever reason, without this,
//             // Sizzle.error will be called but no error will be seen in oldIE
//             Sizzle.call( null, selector );
//         }, function( e ) {
//             return e.message.indexOf("Syntax error") >= 0;
//         }, name + ": " + selector );
//     }

//     broken( "Broken Selector", "[" );
//     broken( "Broken Selector", "(" );
//     broken( "Broken Selector", "{" );
//     broken( "Broken Selector", "<" );
//     broken( "Broken Selector", "()" );
//     broken( "Broken Selector", "<>" );
//     broken( "Broken Selector", "{}" );
//     broken( "Broken Selector", "," );
//     broken( "Broken Selector", ",a" );
//     broken( "Broken Selector", "a," );
//     // Hangs on IE 9 if regular expression is inefficient
//     broken( "Broken Selector", "[id=012345678901234567890123456789");
//     broken( "Doesn't exist", ":visble" );
//     broken( "Nth-child", ":nth-child" );
//     // Sigh again. IE 9 thinks this is also a real selector
//     // not super critical that we fix this case
//     //broken( "Nth-child", ":nth-child(-)" );
//     // Sigh. WebKit thinks this is a real selector in qSA
//     // They've already fixed this and it'll be coming into
//     // current browsers soon. Currently, Safari 5.0 still has this problem
//     // broken( "Nth-child", ":nth-child(asdf)", [] );
//     broken( "Nth-child", ":nth-child(2n+-0)" );
//     broken( "Nth-child", ":nth-child(2+0)" );
//     broken( "Nth-child", ":nth-child(- 1n)" );
//     broken( "Nth-child", ":nth-child(-1 n)" );
//     broken( "First-child", ":first-child(n)" );
//     broken( "Last-child", ":last-child(n)" );
//     broken( "Only-child", ":only-child(n)" );
//     broken( "Nth-last-last-child", ":nth-last-last-child(1)" );
//     broken( "First-last-child", ":first-last-child" );
//     broken( "Last-last-child", ":last-last-child" );
//     broken( "Only-last-child", ":only-last-child" );

//     // Make sure attribute value quoting works correctly. See: #6093
//     var attrbad = jQuery("<input type=\"hidden\" value=\"2\" name=\"foo.baz\" id=\"attrbad1\"/><input type=\"hidden\" value=\"2\" name=\"foo[baz]\" id=\"attrbad2\"/>").appendTo("body");

//     broken( "Attribute not escaped", "input[name=foo.baz]", [] );
//     // Shouldn't be matching those inner brackets
//     broken( "Attribute not escaped", "input[name=foo[baz]]", [] );

//     attrbad.remove();
// });

test("id", function() {
    expect( 30 );

    t( "ID Selector", "#body", ["body"] );
    t( "ID Selector w/ Element", "body#body", ["body"] );
    t( "ID Selector w/ Element", "ul#first", [] );
    t( "ID selector with existing ID descendant", "#firstp #simon1", ["simon1"] );
    t( "ID selector with non-existant descendant", "#firstp #foobar", [] );
    t( "ID selector using UTF8", "#台北Táiběi", ["台北Táiběi"] );
    t( "Multiple ID selectors using UTF8", "#台北Táiběi, #台北", ["台北Táiběi","台北"] );
    t( "Descendant ID selector using UTF8", "div #台北", ["台北"] );
    t( "Child ID selector using UTF8", "form > #台北", ["台北"] );

    t( "Escaped ID", "#foo\\:bar", ["foo:bar"] );
    t( "Escaped ID with descendent", "#foo\\:bar span:not(:input)", ["foo_descendent"] );
    t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
    t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
    t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
    t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
    t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

    var fiddle = jQuery("<div id='fiddle\\Foo'><span id='fiddleSpan'></span></div>").appendTo("#qunit-fixture");
    // deepEqual( Sizzle( "> span", Sizzle("#fiddle\\\\Foo")[0] ), q([ "fiddleSpan" ]), "Escaped ID as context" );
    fiddle.remove();

    t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] ); // bug #267
    t( "ID Selector, not an ancestor ID", "#form #first", [] );
    t( "ID Selector, not a child ID", "#form > #option1a", [] );

    t( "All Children of ID", "#foo > *", ["sndp", "en", "sap"] );
    t( "All Children of ID with no children", "#firstUL > *", [] );

    var a = jQuery("<div><a name=\"tName1\">tName1 A</a><a name=\"tName2\">tName2 A</a><div id=\"tName1\">tName1 Div</div></div>").appendTo("#qunit-fixture");
    equal( Sizzle("#tName1")[0].id, "tName1", "ID selector with same value for a name attribute" );
    equal( Sizzle("#tName2").length, 0, "ID selector non-existing but name attribute on an A tag" );
    a.remove();

    a = jQuery("<a id='backslash\\foo'></a>").appendTo("#qunit-fixture");
    t( "ID Selector contains backslash", "#backslash\\\\foo", ["backslash\\foo"] );

    t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", ["lengthtest"] );

    t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986

    deepEqual( Sizzle("div#form", document.body), [], "ID selector within the context of another element" );

    t( "Underscore ID", "#types_all", ["types_all"] );
    t( "Dash ID", "#qunit-fixture", ["qunit-fixture"] );

    t( "ID with weird characters in it", "#name\\+value", ["name+value"] );
});

test("class", function() {
    //expect( 25 );
    expect(19);

    t( "Class Selector", ".blog", ["mark","simon"] );
    t( "Class Selector", ".GROUPS", ["groups"] );
    t( "Class Selector", ".blog.link", ["simon"] );
    t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
    t( "Parent Class Selector", "p .blog", ["mark","simon"] );

    t( "Class selector using UTF8", ".台北Táiběi", ["utf8class1"] );
    //t( "Class selector using UTF8", ".台北", ["utf8class1","utf8class2"] );
    t( "Class selector using UTF8", ".台北Táiběi.台北", ["utf8class1"] );
    t( "Class selector using UTF8", ".台北Táiběi, .台北", ["utf8class1","utf8class2"] );
    t( "Descendant class selector using UTF8", "div .台北Táiběi", ["utf8class1"] );
    t( "Child class selector using UTF8", "form > .台北Táiběi", ["utf8class1"] );

    t( "Escaped Class", ".foo\\:bar", ["foo:bar"] );
    t( "Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
    t( "Descendant escaped Class", "div .foo\\:bar", ["foo:bar"] );
    t( "Descendant escaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
    t( "Child escaped Class", "form > .foo\\:bar", ["foo:bar"] );
    t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
    var div = document.createElement("div");
    div.innerHTML = "<div class='test e'></div><div class='test'></div>";
    deepEqual( Sizzle(".e", div), [ div.firstChild ], "Finding a second class." );

    div.lastChild.className = "e";

    deepEqual( Sizzle(".e", div), [ div.firstChild, div.lastChild ], "Finding a modified class." );

    // ok( !Sizzle.matchesSelector( div, ".null"), ".null does not match an element with no class" );
    // ok( !Sizzle.matchesSelector( div.firstChild, ".null div"), ".null does not match an element with no class" );
    div.className = "null";
    // ok( Sizzle.matchesSelector( div, ".null"), ".null matches element with class 'null'" );
    // ok( Sizzle.matchesSelector( div.firstChild, ".null div"), "caching system respects DOM changes" );
    // ok( !Sizzle.matchesSelector( document, ".foo" ), "testing class on document doesn't error" );
    // ok( !Sizzle.matchesSelector( window, ".foo" ), "testing class on window doesn't error" );

    div.lastChild.className += " hasOwnProperty toString";
    deepEqual( Sizzle(".e.hasOwnProperty.toString", div), [ div.lastChild ], "Classes match Object.prototype properties" );
});

test("name", function() {
    expect( 15 );

    t( "Name selector", "input[name=action]", ["text1"] );
    t( "Name selector with single quotes", "input[name='action']", ["text1"] );
    t( "Name selector with double quotes", "input[name=\"action\"]", ["text1"] );

    t( "Name selector non-input", "[name=example]", ["name-is-example"] );
    t( "Name selector non-input", "[name=div]", ["name-is-div"] );
    t( "Name selector non-input", "*[name=iframe]", ["iframe"] );

    t( "Name selector for grouped input", "input[name='types[]']", ["types_all", "types_anime", "types_movie"] );

    var form = document.getElementById("form");
    deepEqual( Sizzle("input[name=action]", form), q("text1"), "Name selector within the context of another element" );
    deepEqual( Sizzle("input[name='foo[bar]']", form), q("hidden2"), "Name selector for grouped form element within the context of another element" );

    form = jQuery("<form><input name='id'/></form>").appendTo("body");
    equal( Sizzle("input", form[0]).length, 1, "Make sure that rooted queries on forms (with possible expandos) work." );

    form.remove();

    var a = jQuery("<div><a id=\"tName1ID\" name=\"tName1\">tName1 A</a><a id=\"tName2ID\" name=\"tName2\">tName2 A</a><div id=\"tName1\">tName1 Div</div></div>")
        .appendTo("#qunit-fixture").children();

    equal( a.length, 3, "Make sure the right number of elements were inserted." );
    equal( a[1].id, "tName2ID", "Make sure the right number of elements were inserted." );

    equal( Sizzle("[name=tName1]")[0], a[0], "Find elements that have similar IDs" );
    equal( Sizzle("[name=tName2]")[0], a[1], "Find elements that have similar IDs" );
    t( "Find elements that have similar IDs", "#tName2ID", ["tName2ID"] );

    a.parent().remove();
});

test("multiple", function() {
    expect(6);

    t( "Comma Support", "h2, #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
    t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
    t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
    t( "Comma Support", "h2,#qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
    t( "Comma Support", "h2,#qunit-fixture p ", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
    t( "Comma Support", "h2\t,\r#qunit-fixture p\n", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
});

test("child and adjacent", function() {
    //expect( 42 );
    expect(40);

    t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
    t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
    t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
    t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
    t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
    t( "All Children", "code > *", ["anchor1","anchor2"] );
    t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
    t( "Adjacent", "#qunit-fixture a + a", ["groups"] );
    t( "Adjacent", "#qunit-fixture a +a", ["groups"] );
    t( "Adjacent", "#qunit-fixture a+ a", ["groups"] );
    t( "Adjacent", "#qunit-fixture a+a", ["groups"] );
    t( "Adjacent", "p + p", ["ap","en","sap"] );
    t( "Adjacent", "p#firstp + p", ["ap"] );
    t( "Adjacent", "p[lang=en] + p", ["sap"] );
    t( "Adjacent", "a.GROUPS + code + a", ["mark"] );
    t( "Comma, Child, and Adjacent", "#qunit-fixture a + a, code > a", ["groups","anchor1","anchor2"] );
    t( "Element Preceded By", "#qunit-fixture p ~ div", ["foo", "nothiddendiv", "moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
    t( "Element Preceded By", "#first ~ div", ["moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
    t( "Element Preceded By", "#groups ~ a", ["mark"] );
    t( "Element Preceded By", "#length ~ input", ["idTest"] );
    t( "Element Preceded By", "#siblingfirst ~ em", ["siblingnext", "siblingthird"] );
    t( "Element Preceded By (multiple)", "#siblingTest em ~ em ~ em ~ span", ["siblingspan"] );
    t( "Element Preceded By, Containing", "#liveHandlerOrder ~ div em:contains('1')", ["siblingfirst"] );

    var siblingFirst = document.getElementById("siblingfirst");

    deepEqual( Sizzle("~ em", siblingFirst), q("siblingnext", "siblingthird"), "Element Preceded By with a context." );
    deepEqual( Sizzle("+ em", siblingFirst), q("siblingnext"), "Element Directly Preceded By with a context." );
    //deepEqual( Sizzle("~ em:first", siblingFirst), q("siblingnext"), "Element Preceded By positional with a context." );

    var en = document.getElementById("en");
    //deepEqual( Sizzle("+ p, a", en), q("yahoo", "sap"), "Compound selector with context, beginning with sibling test." );
    deepEqual( Sizzle("a, + p", en), q("yahoo", "sap"), "Compound selector with context, containing sibling test." );

    t( "Multiple combinators selects all levels", "#siblingTest em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
    t( "Multiple combinators selects all levels", "#siblingTest > em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
    t( "Multiple sibling combinators doesn't miss general siblings", "#siblingTest > em:first-child + em ~ span", ["siblingspan"] );
    t( "Combinators are not skipped when mixing general and specific", "#siblingTest > em:contains('x') + em ~ span", [] );

    equal( Sizzle("#listWithTabIndex").length, 1, "Parent div for next test is found via ID (#8310)" );
    equal( Sizzle("#listWithTabIndex li:eq(2) ~ li").length, 1, "Find by general sibling combinator (#8310)" );
    equal( Sizzle("#__sizzle__").length, 0, "Make sure the temporary id assigned by sizzle is cleared out (#8310)" );
    equal( Sizzle("#listWithTabIndex").length, 1, "Parent div for previous test is still found via ID (#8310)" );

    t( "Verify deep class selector", "div.blah > p > a", [] );

    t( "No element deep selector", "div.foo > span > a", [] );

    var nothiddendiv = document.getElementById("nothiddendiv");
    deepEqual( Sizzle("> :first", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );
    deepEqual( Sizzle("> :eq(0)", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );
    deepEqual( Sizzle("> *:first", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );

    t( "Non-existant ancestors", ".fototab > .thumbnails > a", [] );
});

test("attributes", function() {
    //expect( 62 );
    expect(51);

    t( "Attribute Exists", "#qunit-fixture a[title]", ["google"] );
    t( "Attribute Exists (case-insensitive)", "#qunit-fixture a[TITLE]", ["google"] );
    t( "Attribute Exists", "#qunit-fixture *[title]", ["google"] );
    t( "Attribute Exists", "#qunit-fixture [title]", ["google"] );
    t( "Attribute Exists", "#qunit-fixture a[ title ]", ["google"] );

    t( "Boolean attribute exists", "#select2 option[selected]", ["option2d"]);
    t( "Boolean attribute equals", "#select2 option[selected='selected']", ["option2d"]);

    t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", ["simon1"] );
    t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", ["simon1"] );
    t( "Attribute Equals", "#qunit-fixture a[rel=bookmark]", ["simon1"] );
    t( "Attribute Equals", "#qunit-fixture a[href='http://www.google.com/']", ["google"] );
    t( "Attribute Equals", "#qunit-fixture a[ rel = 'bookmark' ]", ["simon1"] );
    t( "Attribute Equals Number", "#qunit-fixture option[value=1]", ["option1b","option2b","option3b","option4b","option5c"] );
    //t( "Attribute Equals Number", "#qunit-fixture li[tabIndex=-1]", ["foodWithNegativeTabIndex"] );
    document.getElementById("anchor2").href = "#2";
    t( "href Attribute", "p a[href^=#]", ["anchor2"] );
    t( "href Attribute", "p a[href*=#]", ["simon1", "anchor2"] );

    t( "for Attribute", "form label[for]", ["label-for"] );
    t( "for Attribute in form", "#form [for=action]", ["label-for"] );

    t( "Attribute containing []", "input[name^='foo[']", ["hidden2"] );
    t( "Attribute containing []", "input[name^='foo[bar]']", ["hidden2"] );
    t( "Attribute containing []", "input[name*='[bar]']", ["hidden2"] );
    t( "Attribute containing []", "input[name$='bar]']", ["hidden2"] );
    t( "Attribute containing []", "input[name$='[bar]']", ["hidden2"] );
    t( "Attribute containing []", "input[name$='foo[bar]']", ["hidden2"] );
    t( "Attribute containing []", "input[name*='foo[bar]']", ["hidden2"] );

    deepEqual( Sizzle( "input[data-comma='0,1']" ), [ document.getElementById("el12087") ], "Without context, single-quoted attribute containing ','" );
    deepEqual( Sizzle( "input[data-comma=\"0,1\"]" ), [ document.getElementById("el12087") ], "Without context, double-quoted attribute containing ','" );
    deepEqual( Sizzle( "input[data-comma='0,1']", document.getElementById("t12087") ), [ document.getElementById("el12087") ], "With context, single-quoted attribute containing ','" );
    deepEqual( Sizzle( "input[data-comma=\"0,1\"]", document.getElementById("t12087") ), [ document.getElementById("el12087") ], "With context, double-quoted attribute containing ','" );

    t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", ["radio1", "radio2", "hidden1"] );
    t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", ["radio1", "radio2", "hidden1"] );
    t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", ["radio1", "radio2", "hidden1"] );

    t( "Attribute selector using UTF8", "span[lang=中文]", ["台北"] );

    t( "Attribute Begins With", "a[href ^= 'http://www']", ["google","yahoo"] );
    t( "Attribute Ends With", "a[href $= 'org/']", ["mark"] );
    t( "Attribute Contains", "a[href *= 'google']", ["google","groups"] );
    t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", ["google","groups","anchor1"] );

    var opt = document.getElementById("option1a"),
        match = Sizzle.matchesSelector;

    opt.setAttribute( "test", "" );

    // ok( match( opt, "[id*=option1][type!=checkbox]" ), "Attribute Is Not Equal Matches" );
    // ok( match( opt, "[id*=option1]" ), "Attribute With No Quotes Contains Matches" );
    // ok( match( opt, "[test=]" ), "Attribute With No Quotes No Content Matches" );
    // ok( !match( opt, "[test^='']" ), "Attribute with empty string value does not match startsWith selector (^=)" );
    // ok( match( opt, "[id=option1a]" ), "Attribute With No Quotes Equals Matches" );
    // ok( match( document.getElementById("simon1"), "a[href*=#]" ), "Attribute With No Quotes Href Contains Matches" );

    t( "Empty values", "#select1 option[value='']", ["option1a"] );
    t( "Empty values", "#select1 option[value!='']", ["option1b","option1c","option1d"] );

    t( "Select options via :selected", "#select1 option:selected", ["option1a"] );
    t( "Select options via :selected", "#select2 option:selected", ["option2d"] );
    t( "Select options via :selected", "#select3 option:selected", ["option3b", "option3c"] );
    t( "Select options via :selected", "select[name='select2'] option:selected", ["option2d"] );

    t( "Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"] );

    var input = document.getElementById("text1");
    input.title = "Don't click me";
    //ok( match( input, "input[title=\"Don't click me\"]" ), "Quote within attribute value does not mess up tokenizer" );

    // Uncomment if the boolHook is removed
    // var check2 = document.getElementById("check2");
    // check2.checked = true;
    // ok( !Sizzle.matches("[checked]", [ check2 ] ), "Dynamic boolean attributes match when they should with Sizzle.matches (#11115)" );

    // jQuery #12303
    input.setAttribute( "data-pos", ":first" );
    // ok( match( input, "input[data-pos=\\:first]"), "POS within attribute value is treated as an attribute value" );
    // ok( match( input, "input[data-pos=':first']"), "POS within attribute value is treated as an attribute value" );
    // ok( match( input, ":input[data-pos=':first']"), "POS within attribute value after pseudo is treated as an attribute value" );
    input.removeAttribute("data-pos");

    // Make sure attribute value quoting works correctly. See: #6093
    var attrbad = jQuery("<input type=\"hidden\" value=\"2\" name=\"foo.baz\" id=\"attrbad1\"/><input type=\"hidden\" value=\"2\" name=\"foo[baz]\" id=\"attrbad2\"/><input type=\"hidden\" data-attr=\"foo_baz']\" id=\"attrbad3\"/>").appendTo("body");

    t( "Underscores are valid unquoted", "input[id=types_all]", ["types_all"] );

    t( "Find escaped attribute value", "input[name=foo\\.baz]", ["attrbad1"] );
    t( "Find escaped attribute value", "input[name=foo\\[baz\\]]", ["attrbad2"] );
    t( "Find escaped attribute value", "input[data-attr='foo_baz\\']']", ["attrbad3"] );

    t( "input[type=text]", "#form input[type=text]", ["text1", "text2", "hidden2", "name"] );
    t( "input[type=search]", "#form input[type=search]", ["search"] );

    attrbad.remove();

    // #6428
    t( "Find escaped attribute value", "#form input[name=foo\\[bar\\]]", ["hidden2"] );

    // #3279
    var div = document.createElement("div");
    div.innerHTML = "<div id='foo' xml:test='something'></div>";

    deepEqual( Sizzle( "[xml\\:test]", div ), [ div.firstChild ], "Finding by attribute with escaped characters." );
    div = null;
});

test("pseudo - (parent|empty)", function() {
    expect( 3 );
    t( "Empty", "ul:empty", ["firstUL"] );
    t( "Empty with comment node", "ol:empty", ["empty"] );
    t( "Is A Parent", "#qunit-fixture p:parent", ["firstp","ap","sndp","en","sap","first"] );
});

test("pseudo - (first|last|only)-(child|of-type)", function() {
    //expect( 12 );
    expect(10);

    t( "First Child", "p:first-child", ["firstp","sndp"] );
    t( "First Child (leading id)", "#qunit-fixture p:first-child", ["firstp","sndp"] );
    t( "First Child (leading class)", ".nothiddendiv div:first-child", ["nothiddendivchild"] );
    t( "First Child (case-insensitive)", "#qunit-fixture p:FIRST-CHILD", ["firstp","sndp"] );

    t( "Last Child", "p:last-child", ["sap"] );
    //t( "Last Child (leading id)", "#qunit-fixture a:last-child", ["simon1","anchor1","mark","yahoo","anchor2","simon","liveLink1","liveLink2"] );
    t( "Only Child", "#qunit-fixture a:only-child", ["simon1","anchor1","yahoo","anchor2","liveLink1","liveLink2"] );

    t( "First-of-type", "#qunit-fixture > p:first-of-type", ["firstp"] );
    t( "Last-of-type", "#qunit-fixture > p:last-of-type", ["first"] );
    //t( "Only-of-type", "#qunit-fixture > :only-of-type", ["name+value", "firstUL", "empty", "floatTest", "iframe", "table"] );

    // Verify that the child position isn't being cached improperly
    var secondChildren = jQuery("p:nth-child(2)").before("<div></div>");

    t( "No longer second child", "p:nth-child(2)", [] );
    secondChildren.prev().remove();
    t( "Restored second child", "p:nth-child(2)", ["ap","en"] );
});

test("pseudo - nth-child", function() {
    //expect( 30 );
    expect(28);

    t( "Nth-child", "p:nth-child(1)", ["firstp","sndp"] );
    t( "Nth-child (with whitespace)", "p:nth-child( 1 )", ["firstp","sndp"] );
    //t( "Nth-child (case-insensitive)", "#form select:first option:NTH-child(3)", ["option1c"] );
    t( "Not nth-child", "#qunit-fixture p:not(:nth-child(1))", ["ap","en","sap","first"] );

    t( "Nth-child(2)", "#qunit-fixture form#form > *:nth-child(2)", ["text1"] );
    t( "Nth-child(2)", "#qunit-fixture form#form > :nth-child(2)", ["text1"] );

    t( "Nth-child(-1)", "#form select:first option:nth-child(-1)", [] );
    t( "Nth-child(3)", "#form select:first option:nth-child(3)", ["option1c"] );
    t( "Nth-child(0n+3)", "#form select:first option:nth-child(0n+3)", ["option1c"] );
    t( "Nth-child(1n+0)", "#form select:first option:nth-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
    t( "Nth-child(1n)", "#form select:first option:nth-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
    t( "Nth-child(n)", "#form select:first option:nth-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
    t( "Nth-child(even)", "#form select:first option:nth-child(even)", ["option1b", "option1d"] );
    t( "Nth-child(odd)", "#form select:first option:nth-child(odd)", ["option1a", "option1c"] );
    t( "Nth-child(2n)", "#form select:first option:nth-child(2n)", ["option1b", "option1d"] );
    t( "Nth-child(2n+1)", "#form select:first option:nth-child(2n+1)", ["option1a", "option1c"] );
    t( "Nth-child(2n + 1)", "#form select:first option:nth-child(2n + 1)", ["option1a", "option1c"] );
    t( "Nth-child(+2n + 1)", "#form select:first option:nth-child(+2n + 1)", ["option1a", "option1c"] );
    t( "Nth-child(3n)", "#form select:first option:nth-child(3n)", ["option1c"] );
    t( "Nth-child(3n+1)", "#form select:first option:nth-child(3n+1)", ["option1a", "option1d"] );
    t( "Nth-child(3n+2)", "#form select:first option:nth-child(3n+2)", ["option1b"] );
    t( "Nth-child(3n+3)", "#form select:first option:nth-child(3n+3)", ["option1c"] );
    t( "Nth-child(3n-1)", "#form select:first option:nth-child(3n-1)", ["option1b"] );
    t( "Nth-child(3n-2)", "#form select:first option:nth-child(3n-2)", ["option1a", "option1d"] );
    t( "Nth-child(3n-3)", "#form select:first option:nth-child(3n-3)", ["option1c"] );
    t( "Nth-child(3n+0)", "#form select:first option:nth-child(3n+0)", ["option1c"] );
    t( "Nth-child(-1n+3)", "#form select:first option:nth-child(-1n+3)", ["option1a", "option1b", "option1c"] );
    t( "Nth-child(-n+3)", "#form select:first option:nth-child(-n+3)", ["option1a", "option1b", "option1c"] );
    t( "Nth-child(-1n + 3)", "#form select:first option:nth-child(-1n + 3)", ["option1a", "option1b", "option1c"] );

    //deepEqual( Sizzle( ":nth-child(n)", null, null, [ document.createElement("a") ].concat( q("ap") ) ), q("ap"), "Seeded nth-child" );
});

test("pseudo - nth-last-child", function() {
    //expect( 30 );
    expect(1);

    //t( "Nth-last-child", "form:nth-last-child(5)", ["testForm"] );
    //t( "Nth-last-child (with whitespace)", "form:nth-last-child( 5 )", ["testForm"] );
    //t( "Nth-last-child (case-insensitive)", "#form select:first option:NTH-last-child(3)", ["option1b"] );
    t( "Not nth-last-child", "#qunit-fixture p:not(:nth-last-child(1))", ["firstp", "ap", "sndp", "en", "first"] );

    //t( "Nth-last-child(-1)", "#form select:first option:nth-last-child(-1)", [] );
    //t( "Nth-last-child(3)", "#form select:first :nth-last-child(3)", ["option1b"] );
    //t( "Nth-last-child(3)", "#form select:first *:nth-last-child(3)", ["option1b"] );
    //t( "Nth-last-child(3)", "#form select:first option:nth-last-child(3)", ["option1b"] );
    //t( "Nth-last-child(0n+3)", "#form select:first option:nth-last-child(0n+3)", ["option1b"] );
    //t( "Nth-last-child(1n+0)", "#form select:first option:nth-last-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
    //t( "Nth-last-child(1n)", "#form select:first option:nth-last-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
    // t( "Nth-last-child(n)", "#form select:first option:nth-last-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
    // t( "Nth-last-child(even)", "#form select:first option:nth-last-child(even)", ["option1a", "option1c"] );
    // t( "Nth-last-child(odd)", "#form select:first option:nth-last-child(odd)", ["option1b", "option1d"] );
    // t( "Nth-last-child(2n)", "#form select:first option:nth-last-child(2n)", ["option1a", "option1c"] );
    // t( "Nth-last-child(2n+1)", "#form select:first option:nth-last-child(2n+1)", ["option1b", "option1d"] );
    // t( "Nth-last-child(2n + 1)", "#form select:first option:nth-last-child(2n + 1)", ["option1b", "option1d"] );
    // t( "Nth-last-child(+2n + 1)", "#form select:first option:nth-last-child(+2n + 1)", ["option1b", "option1d"] );
    // t( "Nth-last-child(3n)", "#form select:first option:nth-last-child(3n)", ["option1b"] );
    // t( "Nth-last-child(3n+1)", "#form select:first option:nth-last-child(3n+1)", ["option1a", "option1d"] );
    // t( "Nth-last-child(3n+2)", "#form select:first option:nth-last-child(3n+2)", ["option1c"] );
    // t( "Nth-last-child(3n+3)", "#form select:first option:nth-last-child(3n+3)", ["option1b"] );
    // t( "Nth-last-child(3n-1)", "#form select:first option:nth-last-child(3n-1)", ["option1c"] );
    // t( "Nth-last-child(3n-2)", "#form select:first option:nth-last-child(3n-2)", ["option1a", "option1d"] );
    // t( "Nth-last-child(3n-3)", "#form select:first option:nth-last-child(3n-3)", ["option1b"] );
    // t( "Nth-last-child(3n+0)", "#form select:first option:nth-last-child(3n+0)", ["option1b"] );
    // t( "Nth-last-child(-1n+3)", "#form select:first option:nth-last-child(-1n+3)", ["option1b", "option1c", "option1d"] );
    // t( "Nth-last-child(-n+3)", "#form select:first option:nth-last-child(-n+3)", ["option1b", "option1c", "option1d"] );
    // t( "Nth-last-child(-1n + 3)", "#form select:first option:nth-last-child(-1n + 3)", ["option1b", "option1c", "option1d"] );

    //deepEqual( Sizzle( ":nth-last-child(n)", null, null, [ document.createElement("a") ].concat( q("ap") ) ), q("ap"), "Seeded nth-last-child" );
});

test("pseudo - nth-of-type", function() {
    //expect( 9 );
    expect(8);

    t( "Nth-of-type(-1)", ":nth-of-type(-1)", [] );
    t( "Nth-of-type(3)", "#ap :nth-of-type(3)", ["mark"] );
    t( "Nth-of-type(n)", "#ap :nth-of-type(n)", ["google", "groups", "code1", "anchor1", "mark"] );
    t( "Nth-of-type(0n+3)", "#ap :nth-of-type(0n+3)", ["mark"] );
    t( "Nth-of-type(2n)", "#ap :nth-of-type(2n)", ["groups"] );
    t( "Nth-of-type(even)", "#ap :nth-of-type(even)", ["groups"] );
    t( "Nth-of-type(2n+1)", "#ap :nth-of-type(2n+1)", ["google", "code1", "anchor1", "mark"] );
    t( "Nth-of-type(odd)", "#ap :nth-of-type(odd)", ["google", "code1", "anchor1", "mark"] );
    //t( "Nth-of-type(-n+2)", "#qunit-fixture > :nth-of-type(-n+2)", ["firstp", "ap", "foo", "nothiddendiv", "name+value", "firstUL", "empty", "form", "floatTest", "iframe", "lengthtest", "table"] );
});

test("pseudo - nth-last-of-type", function() {
    //expect( 9 );
    expect(8);

    t( "Nth-last-of-type(-1)", ":nth-last-of-type(-1)", [] );
    t( "Nth-last-of-type(3)", "#ap :nth-last-of-type(3)", ["google"] );
    t( "Nth-last-of-type(n)", "#ap :nth-last-of-type(n)", ["google", "groups", "code1", "anchor1", "mark"] );
    t( "Nth-last-of-type(0n+3)", "#ap :nth-last-of-type(0n+3)", ["google"] );
    t( "Nth-last-of-type(2n)", "#ap :nth-last-of-type(2n)", ["groups"] );
    t( "Nth-last-of-type(even)", "#ap :nth-last-of-type(even)", ["groups"] );
    t( "Nth-last-of-type(2n+1)", "#ap :nth-last-of-type(2n+1)", ["google", "code1", "anchor1", "mark"] );
    t( "Nth-last-of-type(odd)", "#ap :nth-last-of-type(odd)", ["google", "code1", "anchor1", "mark"] );
    //t( "Nth-last-of-type(-n+2)", "#qunit-fixture > :nth-last-of-type(-n+2)", ["ap", "name+value", "first", "firstUL", "empty", "floatTest", "iframe", "table", "name-tests", "testForm", "liveHandlerOrder", "siblingTest"] );
});

test("pseudo - misc", function() {
    //expect( 43 );
    expect(21);

    t( "Headers", ":header", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
    //t( "Headers(case-insensitive)", ":Header", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
    t( "Has Children - :has()", "p:has(a)", ["firstp","ap","en","sap"] );
    t( "Has Children - :has()", "p:has( a )", ["firstp","ap","en","sap"] );
    //t( "Multiple matches with the same context (cache check)", "#form select:has(option:first-child:contains('o'))", ["select1", "select2", "select3", "select4"] );

    //ok( Sizzle("#qunit-fixture :not(:has(:has(*)))").length, "All not grandparents" );

    var select = document.getElementById("select1"),
        match = Sizzle.matchesSelector;
    //ok( match( select, ":has(option)" ), "Has Option Matches" );

    t( "Text Contains", "a:contains(Google)", ["google","groups"] );
    t( "Text Contains", "a:contains(Google Groups)", ["groups"] );

    t( "Text Contains", "a:contains('Google Groups (Link)')", ["groups"] );
    t( "Text Contains", "a:contains(\"(Link)\")", ["groups"] );
    t( "Text Contains", "a:contains(Google Groups (Link))", ["groups"] );
    t( "Text Contains", "a:contains((Link))", ["groups"] );


    var tmp = document.createElement("div");
    tmp.id = "tmp_input";
    document.body.appendChild( tmp );

    jQuery.each( [ "button", "submit", "reset" ], function( i, type ) {
        jQuery( tmp ).append(
            "<input id='input_T' type='T'/><button id='button_T' type='T'>test</button>".replace(/T/g, type) );

        t( "Input Buttons :" + type, "#tmp_input :" + type, [ "input_" + type, "button_" + type ] );

        // ok( match( Sizzle("#input_" + type)[0], ":" + type ), "Input Matches :" + type );
        // ok( match( Sizzle("#button_" + type)[0], ":" + type ), "Button Matches :" + type );
    });

    document.body.removeChild( tmp );

    // Recreate tmp
    tmp = document.createElement("div");
    tmp.id = "tmp_input";
    tmp.innerHTML = "<span>Hello I am focusable.</span>";
    // Setting tabIndex should make the element focusable
    // http://dev.w3.org/html5/spec/single-page.html#focus-management
    document.body.appendChild( tmp );
    tmp.tabIndex = 0;
    tmp.focus();
    if ( document.activeElement !== tmp || (document.hasFocus && !document.hasFocus()) ||
        (document.querySelectorAll && !document.querySelectorAll("div:focus").length) ) {
        ok( true, "The div was not focused. Skip checking the :focus match." );
        ok( true, "The div was not focused. Skip checking the :focus match." );
    } else {
        t( "tabIndex element focused", ":focus", [ "tmp_input" ] );
        //ok( match( tmp, ":focus" ), ":focus matches tabIndex div" );
    }

    // Blur tmp
    tmp.blur();
    document.body.focus();
    //ok( !match( tmp, ":focus" ), ":focus doesn't match tabIndex div" );
    document.body.removeChild( tmp );

    // Input focus/active
    var input = document.createElement("input");
    input.type = "text";
    input.id = "focus-input";

    document.body.appendChild( input );
    input.focus();

    // Inputs can't be focused unless the document has focus
    if ( document.activeElement !== input || (document.hasFocus && !document.hasFocus()) ||
        (document.querySelectorAll && !document.querySelectorAll("input:focus").length) ) {
        ok( true, "The input was not focused. Skip checking the :focus match." );
        ok( true, "The input was not focused. Skip checking the :focus match." );
    } else {
        t( "Element focused", "input:focus", [ "focus-input" ] );
        //ok( match( input, ":focus" ), ":focus matches" );
    }

    input.blur();

    // When IE is out of focus, blur does not work. Force it here.
    if ( document.activeElement === input ) {
        document.body.focus();
    }

    //ok( !match( input, ":focus" ), ":focus doesn't match" );
    document.body.removeChild( input );

    deepEqual(
        Sizzle( "[id='select1'] *:not(:last-child), [id='select2'] *:not(:last-child)", q("qunit-fixture")[0] ),
        q( "option1a", "option1b", "option1c", "option2a", "option2b", "option2c" ),
        "caching system tolerates recursive selection"
    );

    // Tokenization edge cases
    t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code)", ["ap"] );
    t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code):contains(This link)", ["ap"] );
    //t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", ["ap"] );
    //t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", ["ap"] );
    //t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=\\)]", ["sndp"] );
    //t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=')']", ["sndp"] );

    t( "Multi-pseudo", "#ap:has(*), #ap:has(*)", ["ap"] );
    t( "Multi-positional", "#ap:gt(0), #ap:lt(1)", ["ap"] );
    t( "Multi-pseudo with leading nonexistent id", "#nonexistent:has(*), #ap:has(*)", ["ap"] );
    t( "Multi-positional with leading nonexistent id", "#nonexistent:gt(0), #ap:lt(1)", ["ap"] );

    // Sizzle.selectors.filters.icontains = function( elem, i, match ) {
    //     return Sizzle.getText( elem ).toLowerCase().indexOf( (match[3] || "").toLowerCase() ) > -1;
    // };
    // Sizzle.selectors.setFilters.podium = function( elements, argument ) {
    //     var count = argument == null || argument === "" ? 3 : +argument;
    //     return elements.slice( 0, count );
    // };
    // t( "Backwards-compatible custom pseudos", "a:icontains(THIS BLOG ENTRY)", ["simon1"] );
    // t( "Backwards-compatible custom setFilters", "#form :PODIUM", ["label-for", "text1", "text2"] );
    // t( "Backwards-compatible custom setFilters with argument", "#form input:Podium(1)", ["text1"] );
    // delete Sizzle.selectors.filters.icontains;
    // delete Sizzle.selectors.setFilters.podium;

    //t( "Tokenization stressor", "a[class*=blog]:not(:has(*, :contains(!)), :contains(!)), br:contains(]), p:contains(]), :not(:empty):not(:parent)", ["ap", "mark","yahoo","simon"] );
});


test("pseudo - :not", function() {
    //expect( 43 );
    expect(41);

    t( "Not", "a.blog:not(.link)", ["mark"] );
    t( ":not() with :first", "#foo p:not(:first) .link", ["simon"] );

    t( "Not - multiple", "#form option:not(:contains(Nothing),#option1b,:selected)", ["option1c", "option1d", "option2b", "option2c", "option3d", "option3e", "option4e", "option5b", "option5c"] );
    t( "Not - recursive", "#form option:not(:not(:selected))[id^='option3']", [ "option3b", "option3c"] );

    t( ":not() failing interior", "#qunit-fixture p:not(.foo)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not() failing interior", "#qunit-fixture p:not(div.foo)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not() failing interior", "#qunit-fixture p:not(p.foo)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not() failing interior", "#qunit-fixture p:not(#blargh)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not() failing interior", "#qunit-fixture p:not(div#blargh)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not() failing interior", "#qunit-fixture p:not(p#blargh)", ["firstp","ap","sndp","en","sap","first"] );

    t( ":not Multiple", "#qunit-fixture p:not(a)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not Multiple", "#qunit-fixture p:not( a )", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not Multiple", "#qunit-fixture p:not( p )", [] );
    t( ":not Multiple", "#qunit-fixture p:not(a, b)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not Multiple", "#qunit-fixture p:not(a, b, div)", ["firstp","ap","sndp","en","sap","first"] );
    t( ":not Multiple", "p:not(p)", [] );
    t( ":not Multiple", "p:not(a,p)", [] );
    t( ":not Multiple", "p:not(p,a)", [] );
    t( ":not Multiple", "p:not(a,p,b)", [] );
    t( ":not Multiple", ":input:not(:image,:input,:submit)", [] );
    t( ":not Multiple", "#qunit-fixture p:not(:has(a), :nth-child(1))", ["first"] );

    t( "No element not selector", ".container div:not(.excluded) div", [] );

    t( ":not() Existing attribute", "#form select:not([multiple])", ["select1", "select2", "select5"]);
    t( ":not() Equals attribute", "#form select:not([name=select1])", ["select2", "select3", "select4","select5"]);
    t( ":not() Equals quoted attribute", "#form select:not([name='select1'])", ["select2", "select3", "select4", "select5"]);

    t( ":not() Multiple Class", "#foo a:not(.blog)", ["yahoo", "anchor2"] );
    t( ":not() Multiple Class", "#foo a:not(.link)", ["yahoo", "anchor2"] );
    t( ":not() Multiple Class", "#foo a:not(.blog.link)", ["yahoo", "anchor2"] );

    t( ":not chaining (compound)", "#qunit-fixture div[id]:not(:has(div, span)):not(:has(*))", ["nothiddendivchild", "divWithNoTabIndex"] );
    //t( ":not chaining (with attribute)", "#qunit-fixture form[id]:not([action$='formaction']):not(:button)", ["lengthtest", "name-tests", "testForm"] );
    t( ":not chaining (colon in attribute)", "#qunit-fixture form[id]:not([action='form:action']):not(:button)", ["form", "lengthtest", "name-tests", "testForm"] );
    t( ":not chaining (colon in attribute and nested chaining)", "#qunit-fixture form[id]:not([action='form:action']:button):not(:input)", ["form", "lengthtest", "name-tests", "testForm"] );
    t( ":not chaining", "#form select:not(.select1):contains(Nothing) > option:not(option)", [] );

    t( "positional :not()", "#foo p:not(:last)", ["sndp", "en"] );
    t( "positional :not() prefix", "#foo p:not(:last) a", ["yahoo"] );
    t( "compound positional :not()", "#foo p:not(:first, :last)", ["en"] );
    t( "compound positional :not()", "#foo p:not(:first, :even)", ["en"] );
    t( "compound positional :not()", "#foo p:not(:first, :odd)", ["sap"] );
    t( "reordered compound positional :not()", "#foo p:not(:odd, :first)", ["sap"] );

    t( "positional :not() with pre-filter", "#foo p:not([id]:first)", ["en", "sap"] );
    t( "positional :not() with post-filter", "#foo p:not(:first[id])", ["en", "sap"] );
    t( "positional :not() with pre-filter", "#foo p:not([lang]:first)", ["sndp", "sap"] );
    //t( "positional :not() with post-filter", "#foo p:not(:first[lang])", ["sndp", "en", "sap"] );
});

test("pseudo - position", function() {
    //expect( 34 );
    expect(29);

    //t( "First element", "div:first", ["qunit"] );
    //t( "First element(case-insensitive)", "div:fiRst", ["qunit"] );
    t( "nth Element", "#qunit-fixture p:nth(1)", ["ap"] );
    t( "First Element", "#qunit-fixture p:first", ["firstp"] );
    t( "Last Element", "p:last", ["first"] );
    t( "Even Elements", "#qunit-fixture p:even", ["firstp","sndp","sap"] );
    t( "Odd Elements", "#qunit-fixture p:odd", ["ap","en","first"] );
    t( "Position Equals", "#qunit-fixture p:eq(1)", ["ap"] );
    //t( "Position Equals (negative)", "#qunit-fixture p:eq(-1)", ["first"] );
    t( "Position Greater Than", "#qunit-fixture p:gt(0)", ["ap","sndp","en","sap","first"] );
    t( "Position Less Than", "#qunit-fixture p:lt(3)", ["firstp","ap","sndp"] );

    t( "Check position filtering", "div#nothiddendiv:eq(0)", ["nothiddendiv"] );
    t( "Check position filtering", "div#nothiddendiv:last", ["nothiddendiv"] );
    t( "Check position filtering", "div#nothiddendiv:not(:gt(0))", ["nothiddendiv"] );
    t( "Check position filtering", "#foo > :not(:first)", ["en", "sap"] );
    t( "Check position filtering", "#qunit-fixture select > :not(:gt(2))", ["option1a", "option1b", "option1c"] );
    t( "Check position filtering", "#qunit-fixture select:lt(2) :not(:first)", ["option1b", "option1c", "option1d", "option2a", "option2b", "option2c", "option2d"] );
    t( "Check position filtering", "div.nothiddendiv:eq(0)", ["nothiddendiv"] );
    t( "Check position filtering", "div.nothiddendiv:last", ["nothiddendiv"] );
    t( "Check position filtering", "div.nothiddendiv:not(:lt(0))", ["nothiddendiv"] );

    t( "Check element position", "#qunit-fixture div div:eq(0)", ["nothiddendivchild"] );
    t( "Check element position", "#select1 option:eq(3)", ["option1d"] );
    t( "Check element position", "#qunit-fixture div div:eq(10)", ["names-group"] );
    t( "Check element position", "#qunit-fixture div div:first", ["nothiddendivchild"] );
    t( "Check element position", "#qunit-fixture div > div:first", ["nothiddendivchild"] );
    t( "Check element position", "#dl div:first div:first", ["foo"] );
    t( "Check element position", "#dl div:first > div:first", ["foo"] );
    t( "Check element position", "div#nothiddendiv:first > div:first", ["nothiddendivchild"] );
    t( "Chained pseudo after a pos pseudo", "#listWithTabIndex li:eq(0):contains(Rice)", ["foodWithNegativeTabIndex"] );

    t( "Check sort order with POS and comma", "#qunit-fixture em>em>em>em:first-child,div>em:first", ["siblingfirst", "siblinggreatgrandchild"] );

    t( "Isolated position", ":last", ["last"] );

    //deepEqual( Sizzle( "*:lt(2) + *", null, [], Sizzle("#qunit-fixture > p") ), q("ap"), "Seeded pos with trailing relative" );

    // jQuery #12526
    var context = jQuery("#qunit-fixture").append("<div id='jquery12526'></div>")[0];
    deepEqual( Sizzle( ":last", context ), q("jquery12526"), "Post-manipulation positional" );
    QUnit.reset();

    // Sizzle extension
    //Sizzle.selectors.setFilters["primary"] = Sizzle.selectors.setFilters["first"];
    //t( "Extend Sizzle's POS selectors to rename first to primary", "div:primary", ["qunit"] );
    // Reset
    //delete Sizzle.selectors.setFilters["primary"];
});

test("pseudo - form", function() {
    expect( 10 );

    var extraTexts = jQuery("<input id=\"impliedText\"/><input id=\"capitalText\" type=\"TEXT\">").appendTo("#form");

    t( "Form element :input", "#form :input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "search", "button", "area1", "select1", "select2", "select3", "select4", "select5", "impliedText", "capitalText"] );
    t( "Form element :radio", "#form :radio", ["radio1", "radio2"] );
    t( "Form element :checkbox", "#form :checkbox", ["check1", "check2"] );
    t( "Form element :text", "#form :text", ["text1", "text2", "hidden2", "name", "impliedText", "capitalText"] );
    t( "Form element :radio:checked", "#form :radio:checked", ["radio2"] );
    t( "Form element :checkbox:checked", "#form :checkbox:checked", ["check1"] );
    t( "Form element :radio:checked, :checkbox:checked", "#form :radio:checked, #form :checkbox:checked", ["radio2", "check1"] );

    t( "Selected Option Element", "#form option:selected", ["option1a","option2d","option3b","option3c","option4b","option4c","option4d","option5a"] );
    t( "Selected Option Element are also :checked", "#form option:checked", ["option1a","option2d","option3b","option3c","option4b","option4c","option4d","option5a"] );
    t( "Hidden inputs should be treated as enabled. See QSA test.", "#hidden1:enabled", ["hidden1"] );

    extraTexts.remove();
});

test("pseudo - :target and :root", function() {
    expect( 2 );

    // Target
    var $link = jQuery("<a/>").attr({
        href: "#",
        id: "new-link"
    }).appendTo("#qunit-fixture");

    var oldHash = window.location.hash;
    window.location.hash = "new-link";

    t( ":target", ":target", ["new-link"] );

    $link.remove();
    window.location.hash = oldHash;

    // Root
    equal( Sizzle(":root")[0], document.documentElement, ":root selector" );
});

// test("pseudo - :lang", function() {
//     expect( 24 );
//     ok(false,'wangxiao');
//     var previousLang = document.documentElement.lang;
//     document.documentElement.lang = "en";

//     var $fixture = jQuery("#qunit-fixture").attr( "lang", "fr" ),
//         //xml = createWithFriesXML(),
//         foobar = Sizzle("foo_bar", xml)[0];

//     function testLang( id ) {
//         t( ":lang => " + id, "#" + id + ":lang(fr)", [id] );
//         t( "case-insensitive :lang => " + id, "#" + id + ":lang(FR)", [id] );
//         t( "case-insensitive :lang => " + id, "#" + id + ":lang(Fr)", [id] );
//         t( "prefix check :lang => " + id, "#" + id + ":lang(french)", [] );
//     }

//     testLang("qunit-fixture");
//     testLang("firstUL");

//     Should also match fr + "-"
//     http://www.w3.org/TR/selectors/#lang-pseudo
//     $fixture.attr("lang", "fr-be");

//     testLang("qunit-fixture");
//     testLang("firstUL");

//     ok( !Sizzle.matchesSelector($fixture[0], ":lang(en)"), "Fixture does not match documentElement lang" );
//     ok( !Sizzle.matchesSelector($fixture[0], ":lang(fr\\b)"), "Escape backslashes when creating the lang regex" );
//     $fixture.attr("lang", "fr\\b");
//     t( ":lang => escaped backslash", "#qunit-fixture:lang(fr\\\\b)", ["qunit-fixture"] );

//     XML
//     jQuery("#seite1", xml).attr("xml:lang", "fr");
//     ok( foobar, "foo_bar exists" );
//     ok( Sizzle.matchesSelector(foobar, ":lang(fr)"), "XML :lang(fr)" );
//     ok( Sizzle.matchesSelector(foobar, ":lang(fR)"), "XML case-insensitive :lang(fR)" );
//     ok( !Sizzle.matchesSelector(foobar, ":lang(french)"), "XML prefix check" );

//     raises(function() {
//         Sizzle.call( null, ":lang(*%fr)" );
//     }, function( e ) {
//         return e.message.indexOf("Syntax error") >= 0;
//     }, "lang value must be a valid javascript identifier" );

//     Cleanup
//     $fixture.removeAttr("lang");
//     document.documentElement.lang = previousLang;
// });

test("caching", function() {
    expect( 1 );
    Sizzle( ":not(code)", document.getElementById("ap") );
    deepEqual( Sizzle( ":not(code)", document.getElementById("foo") ), q("sndp", "en", "yahoo", "sap", "anchor2", "simon"), "Reusing selector with new context" );
});
//end

//准备工序
function prepareTest(){
    var html = '<div id="body">'+
'<div id="qunit"></div>'+

'<!-- Test HTML -->'+
'<dl id="dl" style="position:absolute;top:-32767px;left:-32767px;width:1px">'+
'<div id="qunit-fixture">'+
'<p id="firstp">See <a id="simon1" href="http://simon.incutio.com/archive/2003/03/25/#getElementsBySelector" rel="bookmark">this blog entry</a> for more information.</p>'+
'<p id="ap">'+
'Here are some [links] in a normal paragraph: <a id="google" href="http://www.google.com/" title="Google!">Google</a>,'+
'<a id="groups" href="http://groups.google.com/" class="GROUPS">Google Groups (Link)</a>.'+
'This link has <code id="code1"><a href="http://smin" id="anchor1">class="blog"</a></code>:'+
'<a href="http://diveintomark.org/" class="blog" hreflang="en" id="mark">diveintomark</a>'+

'</p>'+
'<div id="foo">'+
'<p id="sndp">Everything inside the red border is inside a div with <code>id="foo"</code>.</p>'+
'<p lang="en" id="en">This is a normal link: <a id="yahoo" href="http://www.yahoo.com/" class="blogTest">Yahoo</a></p>'+
'<p id="sap">This link has <code><a href="#2" id="anchor2">class="blog"</a></code>: <a href="http://simon.incutio.com/" class="blog link" id="simon">Simon Willisons Weblog</a></p>'+
'</div>'+
'<div id="nothiddendiv" style="height:1px;background:white;" class="nothiddendiv">'+
'<div id="nothiddendivchild"></div>'+
'</div>'+
'<span id="name+value"></span>'+
'<p id="first">Try them out:</p>'+
'<ul id="firstUL"></ul>'+
'<ol id="empty"><!-- comment --></ol>'+
'<form id="form" action="formaction">'+
'<label for="action" id="label-for">Action:</label>'+
'<input type="text" name="action" value="Test" id="text1" maxlength="30"/>'+
'<input type="text" name="text2" value="Test" id="text2" disabled="disabled"/>'+
'<input type="radio" name="radio1" id="radio1" value="on"/>'+
'<input type="radio" name="radio2" id="radio2" checked="checked"/>'+
'<input type="checkbox" name="check" id="check1" checked="checked"/>'+
'<input type="checkbox" id="check2" value="on"/>'+
'<input type="hidden" name="hidden" id="hidden1"/>'+
'<input type="text" style="display:none;" name="foo[bar]" id="hidden2"/>'+
'<input type="text" id="name" name="name" value="name" />'+
'<input type="search" id="search" name="search" value="search" />'+
'<button id="button" name="button" type="button">Button</button>'+
'<textarea id="area1" maxlength="30">foobar</textarea>'+
'<select name="select1" id="select1">'+
'<option id="option1a" class="emptyopt" value="">Nothing</option>'+
'<option id="option1b" value="1">1</option>'+
'<option id="option1c" value="2">2</option>'+
'<option id="option1d" value="3">3</option>'+
'</select>'+
'<select name="select2" id="select2">'+
'<option id="option2a" class="emptyopt" value="">Nothing</option>'+
'<option id="option2b" value="1">1</option>'+
'<option id="option2c" value="2">2</option>'+
'<option id="option2d" selected="selected" value="3">3</option>'+
'</select>'+
'<select name="select3" id="select3" multiple="multiple">'+
'<option id="option3a" class="emptyopt" value="">Nothing</option>'+
'<option id="option3b" selected="selected" value="1">1</option>'+
'<option id="option3c" selected="selected" value="2">2</option>'+
'<option id="option3d" value="3">3</option>'+
'<option id="option3e">no value</option>'+
'</select>'+
'<select name="select4" id="select4" multiple="multiple">'+
'<optgroup disabled="disabled">'+
'<option id="option4a" class="emptyopt" value="">Nothing</option>'+
'<option id="option4b" disabled="disabled" selected="selected" value="1">1</option>'+
'<option id="option4c" selected="selected" value="2">2</option>'+
'</optgroup>'+
'<option selected="selected" disabled="disabled" id="option4d" value="3">3</option>'+
'<option id="option4e">no value</option>'+
'</select>'+
'<select name="select5" id="select5">'+
'<option id="option5a" value="3">1</option>'+
'<option id="option5b" value="2">2</option>'+
'<option id="option5c" value="1">3</option>'+
'</select>'+
'<object id="object1" codebase="stupid">'+
'<param name="p1" value="x1" />'+
'<param name="p2" value="x2" />'+
'</object>'+
'<span id="台北Táiběi"></span>'+
'<span id="台北" lang="中文"></span>'+
'<span id="utf8class1" class="台北Táiběi 台北"></span>'+
'<span id="utf8class2" class="台北"></span>'+
'<span id="foo:bar" class="foo:bar"><span id="foo_descendent"></span></span>'+
'<span id="test.foo[5]bar" class="test.foo[5]bar"></span>'+
'<foo_bar id="foobar">test element</foo_bar>'+
'</form>'+
'<b id="floatTest">Float test.</b>'+
'<iframe id="iframe" name="iframe"></iframe>'+
'<form id="lengthtest">'+
'<input type="text" id="length" name="test"/>'+
'<input type="text" id="idTest" name="id"/>'+
'</form>'+
'<table id="table"></table>'+
'<form id="name-tests">'+
'<!-- Inputs with a grouped name attribute. -->'+
'<input name="types[]" id="types_all" type="checkbox" value="all" />'+
'<input name="types[]" id="types_anime" type="checkbox" value="anime" />'+
'<input name="types[]" id="types_movie" type="checkbox" value="movie" />'+
'</form>'+
'<form id="testForm" action="#" method="get">'+
'<textarea name="T3" rows="2" cols="15">?'+
'</textarea>'+
'<input type="hidden" name="H1" value="x" />'+
'<input type="hidden" name="H2" />'+
'<input name="PWD" type="password" value="" />'+
'<input name="T1" type="text" />'+
'<input name="T2" type="text" value="YES" readonly="readonly" />'+
'<input type="checkbox" name="C1" value="1" />'+
'<input type="checkbox" name="C2" />'+
'<input type="radio" name="R1" value="1" />'+
'<input type="radio" name="R1" value="2" />'+
'<input type="text" name="My Name" value="me" />'+
'<input type="reset" name="reset" value="NO" />'+
'<select name="S1">'+
'<option value="abc">ABC</option>'+
'<option value="abc">ABC</option>'+
'<option value="abc">ABC</option>'+
'</select>'+
'<select name="S2" multiple="multiple" size="3">'+
'<option value="abc">ABC</option>'+
'<option value="abc">ABC</option>'+
'<option value="abc">ABC</option>'+
'</select>'+
'<select name="S3">'+
'<option selected="selected">YES</option>'+
'</select>'+
'<select name="S4">'+
'<option value="" selected="selected">NO</option>'+
'</select>'+
'<input type="submit" name="sub1" value="NO" />'+
'<input type="submit" name="sub2" value="NO" />'+
'<input type="image" name="sub3" value="NO" />'+
'<button name="sub4" type="submit" value="NO">NO</button>'+
'<input name="D1" type="text" value="NO" disabled="disabled" />'+
'<input type="checkbox" checked="checked" disabled="disabled" name="D2" value="NO" />'+
'<input type="radio" name="D3" value="NO" checked="checked" disabled="disabled" />'+
'<select name="D4" disabled="disabled">'+
'<option selected="selected" value="NO">NO</option>'+
'</select>'+
'<input id="list-test" type="text" />'+
'<datalist id="datalist">'+
'<option value="option"></option>'+
'</datalist>'+
'</form>'+
'<div id="moretests">'+
'<form>'+
'<div id="checkedtest" style="display:none;">'+
'<input type="radio" name="checkedtestradios" checked="checked"/>'+
'<input type="radio" name="checkedtestradios" value="on"/>'+
'<input type="checkbox" name="checkedtestcheckboxes" checked="checked"/>'+
'<input type="checkbox" name="checkedtestcheckboxes" />'+
'</div>'+
'</form>'+
'<div id="nonnodes"><span>hi</span> there <!-- mon ami --></div>'+
'<div id="t2037">'+
'<div><div class="hidden">hidden</div></div>'+
'</div>'+
'<div id="t6652">'+
'<div></div>'+
'</div>'+
'<div id="t12087">'+
'<input type="hidden" id="el12087" data-comma="0,1"/>'+
'</div>'+
'<div id="no-clone-exception"><object><embed></embed></object></div>'+
'<div id="names-group">'+
'<span id="name-is-example" name="example"></span>'+
'<span id="name-is-div" name="div"></span>'+
'</div>'+
'</div>'+
'<div id="tabindex-tests">'+
'<ol id="listWithTabIndex" tabindex="5">'+
'<li id="foodWithNegativeTabIndex" tabindex="-1">Rice</li>'+
'<li id="foodNoTabIndex">Beans</li>'+
'<li>Blinis</li>'+
'<li>Tofu</li>'+
'</ol>'+
'<div id="divWithNoTabIndex">Im hungry. I should...</div>'+
'<span>...</span><a href="#" id="linkWithNoTabIndex">Eat lots of food</a><span>...</span> |'+
'<span>...</span><a href="#" id="linkWithTabIndex" tabindex="2">Eat a little food</a><span>...</span> |'+
'<span>...</span><a href="#" id="linkWithNegativeTabIndex" tabindex="-1">Eat no food</a><span>...</span>'+
'<span>...</span><a id="linkWithNoHrefWithNoTabIndex">Eat a burger</a><span>...</span>'+
'<span>...</span><a id="linkWithNoHrefWithTabIndex" tabindex="1">Eat some funyuns</a><span>...</span>'+
'<span>...</span><a id="linkWithNoHrefWithNegativeTabIndex" tabindex="-1">Eat some funyuns</a><span>...</span>'+
'</div>'+
'<div id="liveHandlerOrder">'+
'<span id="liveSpan1"><a href="#" id="liveLink1"></a></span>'+
'<span id="liveSpan2"><a href="#" id="liveLink2"></a></span>'+
'</div>'+
'<div id="siblingTest">'+
'<em id="siblingfirst">1</em>'+
'<em id="siblingnext">2</em>'+
'<em id="siblingthird">'+
'<em id="siblingchild">'+
'<em id="siblinggrandchild">'+
'<em id="siblinggreatgrandchild"></em>'+
'</em>'+
'</em>'+
'</em>'+
'<span id="siblingspan"></span>'+
'</div>​'+
'</div>'+
'</dl>'+
'<br id="last"/>'+
'</div>';

    var body = jQuery('body');
    temp = body.html();
    body.html(temp+html)
    body.prop('id','body');
};