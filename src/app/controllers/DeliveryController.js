import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(deliveries);
  }

  async show(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }
    return res.json(delivery);
  }

  async store(req, res) {
    // Run field validations
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // Check if Recipent exists
    const recipient = await Recipient.findByPk(recipient_id, {
      attributes: ['name'],
    });
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient doesnt exists' });
    }

    // Check if Deliveryman exists
    const deliveryman = await Deliveryman.findByPk(deliveryman_id, {
      attributes: ['name', 'email'],
    });
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman doesnt exists' });
    }

    return res.json(await Delivery.create(req.body));
  }

  async update(req, res) {
    // Run field validations
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    return res.json(await delivery.update(req.body));
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }
    await delivery.destroy();
    return res.status(200).send();
  }
}

export default new DeliveryController();
