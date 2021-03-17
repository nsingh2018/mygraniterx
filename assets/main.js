// Mygraniterx.com namespace.
var Gaic = Gaic || {};

// Constants.
Gaic.constants = {

};

// App entry point.
Gaic.app = {

    /**
     * Method that initializes app.
     */
    init: function () {

        // Set element/event handlers.
        Gaic.events.setHandlers();

        // Set dialogs.
        Gaic.events.setDialogs();

        Gaic.events.setSlider();

        Gaic.events.setDatePicker();

        // Set the form validation
        Gaic.forms.validateOnlineForms();
    }
};

/**
 * Constants that can be used throughout this file. Helps prevents magic numbers.
 * To use, do something like:
 *
 *     if (something > Gaic.constants.SOME_CONSTANT) { return; }
 */
Gaic.constants = {

    // Store the maximum total file size for the online forms, in bytes
    'MAX_TOTAL_FILE_SIZE': 10000000 // 10MB

};

/**
 * Helper functions that are called from within here and aren't necessarily tied
 * to any particular event or action.
 *
 * To call a helper function, do something like:
 *
 *     var someValue = Gaic.helpers.someFunctionName();
 */
Gaic.helpers = {

    /**
     * Method to sum the size of the files on an online form page
     */
    totalFileSizes: function() {

        var totalSize = 0; // In bytes

        if ($("#file1")[0].files.length != 0) {
            totalSize += $("#file1")[0].files[0].size;
        }
        if ($("#file2")[0].files.length != 0) {
            totalSize += $("#file2")[0].files[0].size;
        }
        if ($("#file3")[0].files.length != 0) {
            totalSize += $("#file3")[0].files[0].size;
        }
        if ($("#file4")[0].files.length != 0) {
            totalSize += $("#file4")[0].files[0].size;
        }
        if ($("#file5")[0].files.length != 0) {
            totalSize += $("#file5")[0].files[0].size;
        }

        return totalSize;
    },

    /**
     * Make the size of a file in raw bytes more readable.
     * Round up to two decimal places, and move the decimal
     * and use KB or MB accordingly
     */
    makeFileSizeReadable: function(size) {

        prettySize = "";

        if (size > 1000000) {

            // Size is in the megabytes
            size = size / 1000000;

            // Round up, two decimal places
            size = Math.ceil(size * 100) / 100;

            prettySize = size + " MB";
        }
        else if (size > 1000) {

            // Size is in the kilobytes
            size = size / 1000;

            // Round up, two decimal places
            size = Math.ceil(size * 100) / 100;

            prettySize = size + " KB";
        }

        return prettySize;

    },

    /**
     * Update the total size span on an online form
     */
    updateTotalSizeSpan: function() {

        // Update the total size
        var totalSize = Gaic.helpers.totalFileSizes();

        // If the total size is too large, make it red
        if (totalSize > Gaic.constants.MAX_TOTAL_FILE_SIZE) {
            $("#total-size").css("color", "red");
        }
        else {
            // Return it back to its original color
            $("#total-size").css("color", "#222");
        }

        $("#total-size").html(Gaic.helpers.makeFileSizeReadable(totalSize));
    },

    /**
     * Verify recaptcha. kwargs is an associative array to hold any/all
     * incoming arguments. Currently only two are used: a success callback,
     * and an error callback.
     */
    verifyRecaptcha: function(kwargs, recaptchaResponse) {
        //kwargs.success(); 
        //console.log(recaptchaResponse);
        var recaptchaUrl = "/recaptcha_verify";
        var recaptchaData = {
            response: recaptchaResponse
        };
        //console.log(recaptchaData);

        // Send off data to url and get a response containing success or failure
        $.post(recaptchaUrl, recaptchaData, function(response) {
            //console.log(response);

            if (response.success) { kwargs.success(); }
            else { kwargs.error(); }
        });
    }
};

// Define events.
Gaic.events = {

    /**
     * Method that sets element handlers.
     */
    setHandlers: function () {

        // Link to resource center.
        $("#highlight-orange").click(function () { location.href = "/resources"; });

        // Link to MTM.
        $("#highlight-blue").click(function () { location.href = "/formulary_info"; });

        // Link to Members page.
        $("#highlight-green").click(function () { location.href = "/members"; });

        // Link to About Us.
        $("#highlight-yellow").click(function () { location.href = "/mtm"; });

        // Set font size binding.
        $("#inc-font, #dec-font").click(function () {

            // Some locals.
            var size, inc = $(this).attr("id") == "inc-font" ? 1 : -1;

            function updateFontSize(element) {
                if (element.style.fontSize) {
                    size = parseInt(element.style.fontSize.replace("px", ""));
                }
                else size = 14;

                if ((size < 18 && inc == 1) || (size > 14 && inc == -1)) {
                    element.style.fontSize = size + inc + 'px';
                }
            }

            // Adjust font for all <p> elements.
            $("p").each(function () {
                updateFontSize(this);
            });

            // Adjust font for all <li> elements.
            $("li").each(function () {
                updateFontSize(this);
            });
        });

        // Reset font (reload page, for now.)
        $("#font-reset").click(function () { location.href = location.href; });

        // For expanding more information on the Coverage Determinations page
        $("#coverage_expand_link").click(function() {
            $("#coverage_expand").slideDown("slow");
        });

        // For expanding more information on the Appeals and Grivances page, Grievances
        $("#grievance_expand_link").click(function() {
            $("#grievance_expand").slideDown("slow");
        });

        // For expanding more information on the Appeals and Grivances page, Appeals
        $("#appeal_expand_link").click(function() {
            $("#appeal_expand").slideDown("slow");
        });

        // For expanding more information on the Transition Policy page
        $("#trans_pol_expand_link").click(function() {
            $("#trans_pol_expand").slideDown("slow");
        });

        // For expanding more information on the Resources page
        $("#extra_help_expand_link").click(function() {
            $("#extra_help_expand").slideDown("slow");
        });

        // For expanding the "Supporting Information" section on the Cover_Deter form
        $("#support-info").click(function() {
            if ($("#support-info").is(":checked")) {
                $("#support-info-form").slideDown("slow");
            }
            else {
                $("#support-info-form").slideUp("slow");
            }
        });

        // For expanding the "Medication You Are Requesting" section on the Redeter form
        $("#medication-purchased").click(function() {
            $("#medication-purchased-form").slideDown("slow");
        });
        $("#medication-not-purchased").click(function() {
            $("#medication-purchased-form").slideUp("slow");
        });

        // For when the online form button is clicked.
        // Ensure the form is valid, and make sure the total
        // size of the attached files (if any) isn't over
        // the 10MB limit
        $("#online-form-btn").click(function(e) {
            //console.log("Made it");
            //console.log(e);

            // Prevent the form from being submitted/page reload
            e.preventDefault();

            // Check jQuery Validate for a valid form
            if (!$("#online-form").valid()) { return; }

            // Now check for maximum file size
            if (Gaic.helpers.totalFileSizes() > Gaic.constants.MAX_TOTAL_FILE_SIZE) {
                $("#file-size-too-large-dialog").dialog("open");
                return;
            }

            // Verify recaptcha
            Gaic.helpers.verifyRecaptcha({
                success: function() {
                    console.log('succeeded');
                    $("#online-form").submit();
                },
                error: function() {
                    console.log('errored');
                    $("#recaptcha-not-verified-dialog").dialog("open");
                }
            }, $("#g-recaptcha-response").val());
        });

        // Updates the size of the file on the screen for the user to see
        $("input:file").change(function() {

            // Get span id
            var spanID = "#" + this.id + "size";

            // Make sure a file has been selected
            if (this.files.length == 0) {
                // No file has been selected, so clear the corresponding
                // span if there's anything there
                $(spanID).html("");

                // Update total size
                Gaic.helpers.updateTotalSizeSpan();

                return;
            }

            // Get file size
            var fileSize = this.files[0].size;

            // If fileSize is too large, make it red
            if (fileSize > Gaic.constants.MAX_TOTAL_FILE_SIZE) {
                $(spanID).css("color", "red");
            }
            else {
                // Return it back to its original color
                $(spanID).css("color", "#222");
            }

            // Update span to the right of the file select input
            $(spanID).html(Gaic.helpers.makeFileSizeReadable(fileSize));

            // Update the total size
            Gaic.helpers.updateTotalSizeSpan();
        });

        // For expanding another file upload input on the online forms
        $("#attach-another-file-link").click(function() {
            // Check to see which one to show next
            if ($("#file-2-div").css('display') == 'none') { $("#file-2-div").slideDown("slow"); }
            else if ($("#file-3-div").css('display') == 'none') { $("#file-3-div").slideDown("slow"); }
            else if ($("#file-4-div").css('display') == 'none') { $("#file-4-div").slideDown("slow"); }
            else if ($("#file-5-div").css('display') == 'none') {
                $("#file-5-div").slideDown("slow");
                $("#attach-another-file-link").hide();
            }
        });

        $("#PaFormsList").listnav({
            includeAll: false
        });
    },

    /**
     * Method that sets dialog actions, properties, etc.
     */
    setDialogs: function () {

        // Dialog for leaving site.
        $('a[rel=external]').leaveNotice( {
            siteName: 'Granite Alliance Insurance',
            newWindow:true
        });

        // When the leaveNotice plugin activates, start a countdown timer
        // and display that timer in the leaveNotice dialog.
        //$('a[rel=external]').click(function() {

            // Create and start the timer and countdown.
            //Gaic.timer.createTimer(".timer", 10, 1, function(){});

            // Reset the timer if the user clicks on cancel.
            //$("#ln-cancelLink").click(function() { Gaic.timer.cancel = true; });

            // Reset the timer if the user presses esc.
            //$(document).keyup(function(e) { if (e.keyCode == 27) { Gaic.timer.cancel = true; } });
        //});

        // Email us contact form.
        $("#email-form-section").dialog({
            autoOpen: false,
            title: "Email Us",
            closeOnEscape: true,
            width: 550,
            modal: true,
            resizable: false,
            show: "slow",
            beforeClose: function() {
                $("#email-response-div").hide();
            },
            buttons: {
                "Submit": function() {

                    $("#email-response-div").hide();
                    
                    // Make sure form has valid input
                    if (!$("#email-form").valid()) { return; }

                    Gaic.helpers.verifyRecaptcha({
                        success: function() {
                            var url = $("#email-url").val(), data = $("#email-form").serialize();
                            //console.log(data);
                            url = "https://mygraniterx.com/contact_us_email";

                            // Get url and post contact info.
                            $.post(url, data, function(data) {
                                $("#email-response").html(data);

                                // Show response wrapper.
                                $("#email-response-div").show();
                            });
                        },
                        error: function() {
                            $("#email-response").html("Incorrect reCAPTCHA entered. Please try again.");
                            $("#email-response-div").show();
                        }
                    }, $("#g-recaptcha-response").val());
                },
                "Cancel": function() {
                    $(this).dialog("close");

                    // Hide response wrapper.
                    $("#email-response-div").hide();
                }
            }
        });

        // When email us form is clicked.
        $("#email-form-link").click(function() {

            // Open email dialog.
            $("#email-form-section").dialog("open");

            // Set close events.
            $("#email-form-section").on("dialogclose", function() {

                // Clear the form
                $("#firstname").val('');
                $("#lastname").val('');
                $("#memberid").val('');
                $("#dob").val('');
                $("#phone").val('');
                $("#email").val('');
                $("#subject").val('');
                $("#content").val('');
                $("#email-response").html("");
            });
        });

        // Online form submission response dialog
        $("#file-size-too-large-dialog").dialog({
            autoOpen: false,
            title: "File size total too large",
            closeOnEscape: true,
            width: 550,
            modal: true,
            resizable: false,
            show: "slow",
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            }
        });

        // Recaptcha response dialog
        $("#recaptcha-not-verified-dialog").dialog({
            autoOpen: false,
            title: "Incorrect reCAPTCHA",
            closeOnEscape: true,
            width: 550,
            modal: true,
            resizable: false,
            show: "slow",
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            }
        });

        // Formulary changes.
        $("#dmbaFormularyChanges").dialog({
            autoOpen: false,
            title: "Changes to DMBA Medicare Part D Formulary",
            closeOnEscape: true,
            width: 1024,
            modal: true,
            resizable: false,
            show: "slow",
        });

        $("#dmbaFormularyChangesLink").click(function() {
            $("#dmbaFormularyChanges").dialog("open");
        });

        // Formulary changes.
        $("#gaicFormularyChanges").dialog({
            autoOpen: false,
            title: "Changes to Granite Alliance Medicare Part D Formulary",
            closeOnEscape: true,
            width: 1024,
            modal: true,
            resizable: false,
            show: "slow",
        });

        $("#gaicFormularyChangesLink").click(function() {
            $("#gaicFormularyChanges").dialog("open");
        });

        // Deprecated method of submitting email us form info.
        /* $("#email-button").click(function() {

            // Get url
            var url = $("#email-url").val();
            var data = $("#email-form").serialize();
            $.post(url, data, function(data) {
                $("#email-response").html(data);
            });
        });

        $("#cancel-email").click(function() {
            $("#email-form-section").dialog("close");
        }); */
    },

    /**
     * Method to set the carousel properties
     */
    setSlider: function () {

        $('.flexslider').flexslider({
            animation: "slide"
        });

    },

    /**
     * Method to set the jQuery UI date picker
     */
    setDatePicker: function() {

        $(".datepicker").datepicker();

    }
};

// Define form helpers/validators
Gaic.forms = {

    validateOnlineForms: function() {

        $("#email-form").validate({
            rules: {
                'email': {
                    required: true,
                    email: true
                },
                'subject': {
                    required: true
                },
                'content': {
                    required: true
                },
                'dob': {
                    required: true
                }
            }
        });

        $("#online-form").validate({
            rules: {
                'member-email': { required: true, email: true },
                'member-dob': { date: true },
                'member-phone': { phoneUS: true },
                'requesters-phone': { phoneUS: true },
                'prescriber-office-phone': { phoneUS: true, required: true },
                'prescriber-fax': { phoneUS: true, required: true },
                'prescriber-name': { required: true },
                'prescriber-city': { required: true },
                'prescriber-zip': { required: true },
                'prescriber-address': { required: true },
                'prescriber-medication': { required: true },
                'prescriber-frequency': { required: true },
                'prescriber-length': { required: true },
                'prescriber-height': { required: true },
                'prescriber-allergies': { required: true },
                'prescriber-strength': { required: true },
                'prescriber-new': { required: true },
                'prescriber-quantity': { required: true },
                'prescriber-weight': { required: true },
                'prescriber-diagnosis': { required: true },
                'prescribers-fax': { phoneUS: true },
                'prescribers-office': { phoneUS: true },
                'medication-pharm-name' : { required: true },
                'medication-pharm-num': { phoneUS: true },
                'medication-date-purchased': { date: true },
                'medication-amount': { required: true },
                'file1': { required: false, extension: 'pdf|docx|doc|jpg|jpeg|png|gif' },
                'file2': { required: false, extension: 'pdf|docx|doc|jpg|jpeg|png|gif' },
                'file3': { required: false, extension: 'pdf|docx|doc|jpg|jpeg|png|gif' },
                'file4': { required: false, extension: 'pdf|docx|doc|jpg|jpeg|png|gif' },
                'file5': { required: false, extension: 'pdf|docx|doc|jpg|jpeg|png|gif' }
            },
            focusInvalid: false,
            invalidHandler: function(form, validator) {
                if (!validator.numberOfInvalids())
                    return;

                $('html, body').animate({
                    scrollTop: ($(validator.errorList[0].element).offset().top) - 100
                }, 1000);
            }
        });
    }
}

/**
 * This timer object is used with the leaveNotice plugin to
 * display a countdown of the number of seconds remaining
 * until flow is directed to an outside resource.
 */
Gaic.timer = {

    // This flag is used to cancel the timer when the user
    // clicks on the cancel button or presses escape.
    cancel: false,

    // This function creates the timer and starts it.
    // selector: The class name of the element that will show the countdown timer
    // seconds: The desired countdown time, in seconds
    createTimer: function(selector, seconds) {

        // Create the timer function
        var timer = function() {

            // If the cancel flag is true, cancel the timer.
            if (Gaic.timer.cancel) {
                Gaic.timer.cancel = false;
                return;
            }

            // Decrease the seconds by one second, update the selector
            seconds -= 1;
            $(selector).text(String(seconds));

            // Continue the timer if there's time left
            if (seconds > 0)
                // Call this function again in one second.
                setTimeout(timer, 1000);
        };

        // Get the timer going.
        setTimeout(timer, 1000);
    }
}
