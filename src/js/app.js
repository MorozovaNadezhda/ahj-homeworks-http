/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-globals */

import defaultData from './defaultData';
import Display from './Display';
import Popovers from './Popovers';
import DeleteTicket from './DeleteTicket';
import XHR from './XHR';

const display = new Display();
const popovers = new Popovers(document.body);
const deleteTicket = new DeleteTicket();
const xhr = new XHR();
const body = document.querySelector('body');

class HelpDesk {
  constructor() {
    this.tickets = document.querySelector('#tickets');
    this.addTicket = document.querySelector('#add-ticket');
    this.id = null;
  }

  async init() {
    defaultData(true);
    const arrayTickets = await xhr.getTickets();
    display.displayTickets(arrayTickets);

    popovers.bindToDOM();
    popovers.saveTicket(this.saveTicket.bind(this));

    this.ticketName = document.querySelector('#name');
    this.ticketDescription = document.querySelector('#description');
    this.titlePopup = document.querySelector('#title-popup');
    deleteTicket.init();
    this.eventsTicket();
    body.onload = this.onLoad();
  }

  onkeydown() {
    if (event.keyCode > 111 && event.keyCode < 124) {
      event.keyCode = 0;
      window.event.returnValue = false;
      window.event.cancelBubble = true;
      return false;
    }
  }

  onLoad() {
    document.onkeydown = onkeydown;
    defaultData(false);
    console.log('reloaded');
    console.log('no default data')
  }

  eventsTicket() {
    this.tickets.addEventListener('click', async (event) => {
      const ticketChanger = event.target.classList;
      this.id = event.target.closest('.ticket').dataset.id;
      // change the status
      if (ticketChanger.contains('change-status')) {
        const ticketStatus = event.target.dataset.status;
        const sendStatus = ticketStatus === 'true' ? 'false' : 'true';
        await xhr.changeStatus(this.id, sendStatus);
        const arrayTickets = await xhr.getTickets();
        display.displayTickets(arrayTickets);
        console.log('status changed');
      }

      // change add-ticket
      if (ticketChanger.contains('edit-ticket')) {
        const itemName = event.target.closest('.ticket').querySelector('.ticket-name').innerText;
        const description = await xhr.getDescription(this.id);
        this.ticketName.value = itemName;
        this.ticketDescription.value = description;
        this.titlePopup.innerText = 'Изменить тикет';
        popovers.showPopup();
      }

      // delete the ticket
      if (ticketChanger.contains('delete-ticket')) {
        deleteTicket.deleteElement(this.deleteProduct.bind(this));
      }

      // get the description
      if (ticketChanger.contains('ticket-name')) {
        const ticketDescription = event.target.parentNode.querySelector('.description');
        if (!ticketDescription) {
          const description = await xhr.getDescription(this.id);
          const elementDescription = document.createElement('div');
          elementDescription.className = 'description';
          elementDescription.innerHTML = `
          <p>${description}</p>
          `;
          event.target.parentNode.appendChild(elementDescription);
        } else {
          ticketDescription.classList.toggle('hidden');
        }
      }
    });

    this.addTicket.addEventListener('click', () => {
      this.id = null;
      this.titlePopup.innerText = 'Добавить тикет';
      popovers.showPopup();
    });
  }

  async deleteProduct() {
    await xhr.deleteTicket(this.id);
    const arrayTickets = await xhr.getTickets();
    display.displayTickets(arrayTickets);
  }

  async saveTicket() {
    if (this.id !== null) {
      await xhr.editTickets(this.id, this.ticketName.value, this.ticketDescription.value);
    } else {
      await xhr.addTicket(this.ticketName.value, this.ticketDescription.value);
    }
    const arrayTickets = await xhr.getTickets();
    display.displayTickets(arrayTickets);
  }
}

const helpDesk = new HelpDesk();
helpDesk.init();