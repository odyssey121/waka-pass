import React from 'react';
import { Modal, Icon } from 'antd';
import './modal.css';

const confirm = Modal.confirm;

export const ConfirmBlue = (obj) => {
    confirm({
        title: 'Внимание!',
        icon: <Icon type="question-circle" />,
        content: <span>Вы действительно хотите добавить нового пользоавателя?</span>,
        cancelText: 'Отмена',
        okText: 'Добавить',
        centered: true,
        className: 'blueConfirm',
        ...obj
    });
};

export const showSuccessModal = (obj, seconds) => {
    // если передано время закрытия используем его (если нет = 5)
    let secondsToClose = (seconds ? seconds : 5);
    // создаем модальное окно
    const successEmployeeAction = Modal.confirm(obj);
    // обновляем кнопку
    setNewButtonCaption(successEmployeeAction, obj.okText, secondsToClose);
    // обновляем состоянии кнопки по счеткику
    const timer = setInterval(() => {
        secondsToClose -= 1;
        setNewButtonCaption(successEmployeeAction, obj.okText, secondsToClose);
    }, 1000);
    // закрываем окно по окончании отсчета
    setTimeout(() => {
        clearInterval(timer);
        successEmployeeAction.destroy();
    }, secondsToClose * 1000);
};

// дбавляем кол-во оставшихся до закрытия окна секунд к подписи кнопки
const setNewButtonCaption = (comp, text, seconds) => {
    comp.update({
        okText: text + " (" + seconds + ")",
    });
};
