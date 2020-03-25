import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, product } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}> `,
      subject: 'New Delivery',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        product,
      },
    });
  }
}

export default new NewDeliveryMail();
