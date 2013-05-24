var Montage = require("montage").Montage,
    AbstractRadioButton = require("montage/ui/base/abstract-radio-button").AbstractRadioButton,
    MockDOM = require("mocks/dom");

AbstractRadioButton.hasTemplate = false;

describe("test/base/abstract-radio-button-spec", function () {

    describe("creation", function () {
        it("cannot be instantiated directly", function () {
            expect(function () {
                AbstractRadioButton.create();
            }).toThrow();
        });

        it("can be instantiated as a subtype", function () {
            var InputRadioSubtype = Montage.create(AbstractRadioButton, {});
            var aRadioButtonSubtype = null;
            expect(function () {
                aRadioButtonSubtype = InputRadioSubtype.create();
            }).not.toThrow();
            expect(aRadioButtonSubtype).toBeDefined();
        });
    });

    describe("properties", function () {
        var InputRadio = Montage.create(AbstractRadioButton, {}),
            aRadioButton;

        beforeEach(function () {
            aRadioButton = InputRadio.create();
            aRadioButton.element = MockDOM.element();
        });

        describe("checked", function () {
            beforeEach(function () {
                aRadioButton = InputRadio.create();
                aRadioButton.element = MockDOM.element();
                aRadioButton.checked = false;
                aRadioButton.prepareForActivationEvents();
            });

            it("should be true when the PressComposer fires a pressStart + press", function() {
                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(aRadioButton.checked).toBe(true);
            });

            it("should be false when the PressComposer fires a pressStart + pressCancel", function() {
                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("pressCancel");

                expect(aRadioButton.checked).toBe(false);
            });

            it("should add the corresponding class name to classList when checked", function() {
                aRadioButton.checked = true;

                expect(aRadioButton.classList.contains("montage-RadioButton--checked")).toBe(true);
            });
        });

        describe("enabled", function () {
            beforeEach(function () {
                aRadioButton = InputRadio.create();
                aRadioButton.element = MockDOM.element();
                aRadioButton.checked = false;
                aRadioButton.prepareForActivationEvents();
            });

            it("should not get checked when enabled is false and PressComposer fires a press", function() {
                aRadioButton.enabled = false;

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(aRadioButton.checked).toBe(false);
            });

            it("should not dispatch an action event when enabled is false and PressComposer fires a press", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aRadioButton.addEventListener("action", callback, false);
                aRadioButton.enabled = false;

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should add the corresponding class name to classList when enabled is false", function() {
                aRadioButton.enabled = false;

                expect(aRadioButton.classList.contains("montage--disabled")).toBe(true);
            });
        });

        describe("active", function () {
            beforeEach(function () {
                aRadioButton = InputRadio.create();
                aRadioButton.element = MockDOM.element();
                aRadioButton.checked = false;
                aRadioButton.prepareForActivationEvents();
            });

            it("should be true when the PressComposer fires a pressStart", function() {
                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                expect(aRadioButton.active).toBe(true);
            });

            it("should be false when the PressComposer fires a pressStart + press", function() {
                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");
                expect(aRadioButton.active).toBe(false);
            });

            it("should be false when the PressComposer fires a pressStart + press while checked", function() {
                aRadioButton.checked = true;

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(aRadioButton.active).toBe(false);
            });

            it("should be false when the PressComposer fires a pressStart + pressCancel", function() {
                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("pressCancel");
                expect(aRadioButton.active).toBe(false);
            });

            it("should add the corresponding class name to classList when active", function() {
                aRadioButton.active = true;

                expect(aRadioButton.classList.contains("montage--active")).toBe(true);
            });
        });
    });

    describe("draw", function () {
        var InputRadio = Montage.create(AbstractRadioButton, {}),
            aRadioButton;

        beforeEach(function () {
            aRadioButton = InputRadio.create();
            aRadioButton.element = MockDOM.element();
        });

        it("should be requested after enabled state is changed", function () {
            aRadioButton.enabled = ! aRadioButton.enabled;
            expect(aRadioButton.needsDraw).toBeTruthy();
        });
        it("should be requested after active is changed", function () {
            aRadioButton.active = true;
            expect(aRadioButton.needsDraw).toBeTruthy();
        });
    });

    describe("events", function () {
        var InputRadio = Montage.create(AbstractRadioButton, {}),
            aRadioButton, anElement, listener;

        beforeEach(function () {
            aRadioButton = InputRadio.create();
            anElement = MockDOM.element();
            listener = {
                handleEvent: function() {}
            };
        });
        it("should listen for press only after prepareForActivationEvents", function() {
            var listeners,
                em = aRadioButton.eventManager;

            listeners = em.registeredEventListenersForEventType_onTarget_("press", aRadioButton);

            expect(listeners).toBeNull();

            aRadioButton.prepareForActivationEvents();

            listeners = em.registeredEventListenersForEventType_onTarget_("press", aRadioButton._pressComposer);
            expect(listeners[aRadioButton.uuid].listener).toBe(aRadioButton);
        });
        describe("once prepareForActivationEvents is called", function () {
            beforeEach(function () {
                aRadioButton.prepareForActivationEvents();
            });
            it("should fire an 'action' event when the PressComposer fires a pressStart + press", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aRadioButton.addEventListener("action", callback, false);

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(callback).toHaveBeenCalled();
            });

            it("should not fire an 'action' event when the PressComposer fires a pressStart + pressCancel", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aRadioButton.addEventListener("action", callback, false);

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("pressCancel");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should not fire an 'action' event when the PressComposer fires a pressStart + press and already checked", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.type).toEqual("action");
                });
                aRadioButton.addEventListener("action", callback, false);
                aRadioButton.checked = true;

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should fire an 'action' event with the contents of the detail property", function() {
                var callback = jasmine.createSpy().andCallFake(function(event) {
                    expect(event.detail.get("foo")).toEqual("bar");
                });
                aRadioButton.addEventListener("action", callback, false);
                aRadioButton.detail.set("foo", "bar");

                aRadioButton._pressComposer.dispatchEventNamed("pressStart");
                aRadioButton._pressComposer.dispatchEventNamed("press");

                expect(callback).toHaveBeenCalled();
            });
        });
    });

});
