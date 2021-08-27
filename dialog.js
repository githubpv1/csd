/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

var aria = aria || {};

aria.Utils = aria.Utils || {};

var isKeyClick = true ;

(function () {
  /*
   * 
   */
  aria.Utils.IgnoreUtilFocusChanges = false;

  aria.Utils.dialogOpenClass = 'has-dialog';

  /**
   * @desc 
   *       Установите фокус на дочерние узлы, пока не будет найден первый элемент, на который   можно сфокусироваться.
   * @param element
   *     Узел DOM, для которого нужно найти первого целевого потомка.
   * @returns
   *  Значение true, если фокусируемый элемент найден и фокус установлен.
   */
  aria.Utils.focusFirstDescendant = function (element) {
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (aria.Utils.attemptFocus(child) ||
          aria.Utils.focusFirstDescendant(child)) {
        return true;
      }
    }
    return false;
  }; // end focusFirstDescendant

  /**
   * @desc Find the last descendant node that is focusable.
   * @param element
   *          DOM node for which to find the last focusable descendant.
   * @returns
   *  true if a focusable element is found and focus is set.
   * Найдите последний дочерний узел, на котором можно сфокусироваться.
    * элемент @param
    * Узел DOM, для которого нужно найти последнего целевого потомка.
    * @returns
    * true, если фокусируемый элемент найден и фокус установлен.
   */
  aria.Utils.focusLastDescendant = function (element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];
      if (aria.Utils.attemptFocus(child) ||
          aria.Utils.focusLastDescendant(child)) {
        return true;
      }
    }
    return false;
  }; // end focusLastDescendant

  /**
   * @desc Установить Попытку установить фокус на текущий узел.
   * @param element
   * Узел, на котором нужно сосредоточиться.
   * @returns
   *  true если элемент сфокусирован.
   */
  aria.Utils.attemptFocus = function (element) {
    if (!aria.Utils.isFocusable(element)) {
      return false;
    }

    aria.Utils.IgnoreUtilFocusChanges = true;
    try {
      if (isKeyClick) {
        element.focus();
      }
    }
    catch (e) {
    }
    aria.Utils.IgnoreUtilFocusChanges = false;
    return (document.activeElement === element);
  }; // end attemptFocus

  /* Модальные окна могут открывать модальные окна. Следите за ними с помощью этого массива. */
  aria.OpenDialogList = aria.OpenDialogList || new Array(0);

  /**
   * @returns the last opened dialog (the current dialog)
   */
  aria.getCurrentDialog = function () {
    if (aria.OpenDialogList && aria.OpenDialogList.length) {
      return aria.OpenDialogList[aria.OpenDialogList.length - 1];
    }
  };

  aria.closeCurrentDialog = function () {
    var currentDialog = aria.getCurrentDialog();
    if (currentDialog) {
      currentDialog.close();
      return true;
    }

    return false;
  };

  aria.handleEscape = function (event) {
    var key = event.which || event.keyCode;

    if (key === aria.KeyCode.ESC && aria.closeCurrentDialog()) {
      event.stopPropagation();
    }
  };

  document.addEventListener('keyup', aria.handleEscape);

  /**
   * @constructor
   * @desc Объект диалога, обеспечивающий модальное управление фокусом.
   * Предположения: элемент, служащий контейнером диалога, присутствует в DOM и скрыт. Контейнер диалога имеет role = 'dialog'.
   *
   * @param dialogId
   *          Идентификатор элемента, служащего контейнером диалога.
   * @param focusAfterClosed
   * Либо узел DOM, либо идентификатор узла DOM, на который нужно сфокусироваться при закрытии диалога.
   * @param focusFirst
   * Необязательный параметр, содержащий либо узел DOM, либо идентификатор узла DOM, на который нужно сфокусироваться при открытии диалогового окна. Если не указано, фокус получит первый фокусируемый элемент в диалоговом окне.
   */
  aria.Dialog = function (dialogId, focusAfterClosed, focusFirst) {
    this.dialogNode = document.getElementById(dialogId);
    if (this.dialogNode === null) {
      throw new Error('No element found with id="' + dialogId + '".');
    }

    var validRoles = ['dialog', 'alertdialog'];
    var isDialog = (this.dialogNode.getAttribute('role') || '')
      .trim()
      .split(/\s+/g)
      .some(function (token) {
        return validRoles.some(function (role) {
          return token === role;
        });
      });
    if (!isDialog) {
      throw new Error(
        'Dialog() requires a DOM element with ARIA role of dialog or alertdialog.');
    }

    // Wrap in an individual backdrop element if one doesn't exist
    // Native <dialog> elements use the ::backdrop pseudo-element, which
    // works similarly.
    // Оберните отдельный элемент фона, если он не существует
    // Собственные элементы <dialog> используют псевдоэлемент :: backdrop, который
    // работает аналогично.
    var backdropClass = 'dialog-backdrop';
    if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
      this.backdropNode = this.dialogNode.parentNode;
    }
    else {
      this.backdropNode = document.createElement('div');
      this.backdropNode.className = backdropClass;
      this.dialogNode.parentNode.insertBefore(this.backdropNode, this.dialogNode);
      this.backdropNode.appendChild(this.dialogNode);
    }
    this.backdropNode.classList.add('active');

    // Disable scroll on the body element
    document.body.classList.add(aria.Utils.dialogOpenClass);

    if (typeof focusAfterClosed === 'string') {
      this.focusAfterClosed = document.getElementById(focusAfterClosed);
    }
    else if (typeof focusAfterClosed === 'object') {
      this.focusAfterClosed = focusAfterClosed;
    }
    else {
      throw new Error(
        'the focusAfterClosed parameter is required for the aria.Dialog constructor.');
    }

    if (typeof focusFirst === 'string') {
      this.focusFirst = document.getElementById(focusFirst);
    }
    else if (typeof focusFirst === 'object') {
      this.focusFirst = focusFirst;
    }
    else {
      this.focusFirst = null;
    }

    // Закрепите диалоговый узел двумя невидимыми фокусируемыми узлами. Пока этот диалог открыт, мы используем их, чтобы убедиться, что фокус никогда не покидает документ, даже если dialogNode является первым или последним узлом.
    var preDiv = document.createElement('div');
    this.preNode = this.dialogNode.parentNode.insertBefore(preDiv,
      this.dialogNode);
    this.preNode.tabIndex = 0;
    var postDiv = document.createElement('div');
    this.postNode = this.dialogNode.parentNode.insertBefore(postDiv,
      this.dialogNode.nextSibling);
    this.postNode.tabIndex = 0;

    // Если это модальное окно открывается поверх уже открытого, избавьтесь от прослушивателя фокуса документа открытого диалогового окна.
    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().removeListeners();
    }

    this.addListeners();
    aria.OpenDialogList.push(this);
    this.clearDialog();
    this.dialogNode.className = 'default_dialog'; // make visible

    if (isKeyClick && this.focusFirst) {
      this.focusFirst.focus();
    }
    else {
      aria.Utils.focusFirstDescendant(this.dialogNode);
    }

    this.lastFocus = document.activeElement;
  }; // end Dialog constructor

  aria.Dialog.prototype.clearDialog = function () {
    Array.prototype.map.call(
      this.dialogNode.querySelectorAll('input'),
      function (input) {
        input.value = '';
      }
    );
  };

  /**
   * @desc
   * Скрывает текущий верхний диалог, удаляет слушателей верхнего диалога,
восстанавливает слушателей родительского диалога, если он был открыт под тем, который только что закрылся, и устанавливает фокус на элемент, указанный для focusAfterClosed.
   */
  aria.Dialog.prototype.close = function () {
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode);
    this.dialogNode.className = 'hidden';
    this.backdropNode.classList.remove('active');
    if (isKeyClick) {
      this.focusAfterClosed.focus();
		}

    // If a dialog was open underneath this one, restore its listeners.
    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().addListeners();
    }
    else {
      document.body.classList.remove(aria.Utils.dialogOpenClass);
    }
  }; // end close

  /**
   * @desc
   *Скрывает текущий диалог и заменяет его другим.
   * @param newDialogId
   *  ID диалога, который заменит текущий открытый верхний диалог.
   * @param newFocusAfterClosed
   * Необязательный идентификатор или узел DOM, указывающий, где разместить фокус при закрытии нового диалогового окна. Если не указан, фокус будет помещен на элемент, указанный в заменяемом диалоговом окне.
   * @param newFocusFirst
   *  Необязательный идентификатор или узел DOM, указывающий, где разместить фокус в новом диалоговом окне при его открытии. Если не указано, фокус получит первый фокусируемый элемент.
   */
  aria.Dialog.prototype.replace = function (newDialogId, newFocusAfterClosed,
    newFocusFirst) {
    var closedDialog = aria.getCurrentDialog();
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode);
    this.dialogNode.className = 'hidden';
    this.backdropNode.classList.remove('active');

    var focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed;
    var dialog = new aria.Dialog(newDialogId, focusAfterClosed, newFocusFirst);
  }; // end replace

  aria.Dialog.prototype.addListeners = function () {
    document.addEventListener('focus', this.trapFocus, true);
  }; // end addListeners

  aria.Dialog.prototype.removeListeners = function () {
    document.removeEventListener('focus', this.trapFocus, true);
  }; // end removeListeners

  aria.Dialog.prototype.trapFocus = function (event) {
    if (aria.Utils.IgnoreUtilFocusChanges) {
      return;
    }
    var currentDialog = aria.getCurrentDialog();
    if (currentDialog.dialogNode.contains(event.target)) {
      currentDialog.lastFocus = event.target;
    }
    else {
      aria.Utils.focusFirstDescendant(currentDialog.dialogNode);
      if (currentDialog.lastFocus == document.activeElement) {
        aria.Utils.focusLastDescendant(currentDialog.dialogNode);
      }
      currentDialog.lastFocus = document.activeElement;
    }
  }; // end trapFocus

  window.openDialog = function (dialogId, focusAfterClosed, focusFirst) {
    var dialog = new aria.Dialog(dialogId, focusAfterClosed, focusFirst);
  };

  window.closeDialog = function (closeButton) {
    var topDialog = aria.getCurrentDialog();
    if (topDialog.dialogNode.contains(closeButton)) {
      topDialog.close();
    }
  }; // end closeDialog

  window.replaceDialog = function (newDialogId, newFocusAfterClosed,
    newFocusFirst) {
    var topDialog = aria.getCurrentDialog();
    if (topDialog.dialogNode.contains(document.activeElement)) {
      topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
    }
  }; // end replaceDialog  replace - заменить

}());

