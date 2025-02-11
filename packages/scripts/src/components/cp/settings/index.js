// eslint-disable no-undef
$(() => {
  const sessionTime = $('#session-time');
  const sessionCount = $('#session-count');
  const sessionSecret = $('#session-secret');

  const sessionContext = $('select#session-context');
  sessionContext.on({
    change: function () {
      const self = $(this);
      const value = self.val();

      switch (value) {
        case 'payload':
          sessionSecret.removeClass('hidden');
          sessionCount.addClass('hidden');
          sessionTime.addClass('hidden');

          break;

        case 'session':
        case 'database':
          sessionSecret.addClass('hidden');
          sessionCount.removeClass('hidden');
          sessionTime.removeClass('hidden');

          break;
      }
    },
  });

  const purgeToggle = $("input[name='purge-toggle']").parents('.lightswitch');
  purgeToggle.on({
    change: function () {
      const isOn = $('input', this).val();
      if (!isOn) {
        $('select#purge-value').val(0);
      }
    },
  });

  const spamProtectionBehaviour = $('select#spam-protection-behaviour');
  spamProtectionBehaviour.on({
    change: function () {
      const customError = $('#custom-spam-error-message');
      if ($(this).val() === 'display_errors') {
        customError.show('fast');
      } else {
        customError.hide('fast');
      }
    },
  });

  const scriptInsertLocation = $('select[name="settings[scriptInsertLocation]"]');
  const warningText = $('#script-insert-warning').text();
  scriptInsertLocation.on({
    change: function () {
      const value = $(this).val();
      const parent = $(this).parents('.field:first');

      if (value === 'manual') {
        const warning = document.createElement('div');
        warning.classList.add('warning', 'with-icon');
        warning.innerText = warningText;

        console.log(parent, warning);
        parent.append(warning);
      } else {
        parent.find('.warning.with-icon').remove();
      }
    },
  });

  scriptInsertLocation.trigger('change');

  const notificationsMigrator = $('#notifications-migrator');
  if (notificationsMigrator) {
    const button = $('#migrate', notificationsMigrator);

    button.on({
      click: (event) => {
        if (!confirm('Are you sure you want to migrate database notifications to file based ones?')) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }

        const removeDbNotifications = $('#remove-files', notificationsMigrator).is(':checked');

        $.ajax({
          url: Craft.getCpUrl('freeform/migrate/notifications/db-to-file'),
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            removeDbNotifications,
            [Craft.csrfTokenName]: Craft.csrfTokenValue,
          }),
          success: (response) => {
            if (response.success) {
              notificationsMigrator.html(
                $(`<div class="pane">
                  <p>
                    <span class="checkmark-icon"></span>
                    Migrated successfully
                  </p> 
                </div>
                `)
              );
            }
          },
        });

        event.preventDefault();
        event.stopPropagation();
        return false;
      },
    });
  }
});
