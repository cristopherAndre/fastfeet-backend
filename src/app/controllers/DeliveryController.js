import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import User from '../models/User';

class DeliveryController {
  async index(req, res) {
    // Check if user is admin
    const user = await User.findByPk(req.userId);
    if (!user.admin)
      return res
        .status(401)
        .json({ error: 'Current user is not administrator!' });

    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(deliveries);
  }

  async show(req, res) {
    // Check if user is admin
    const user = await User.findByPk(req.userId);
    if (!user.admin)
      return res
        .status(401)
        .json({ error: 'Current user is not administrator!' });

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }
    return res.json(delivery);
  }

  async store(req, res) {
    // Check if user is admin
    const user = await User.findByPk(req.userId);
    if (!user.admin)
      return res
        .status(401)
        .json({ error: 'Current user is not administrator!' });

    // Run field validations
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Fails' });
    }

    return res.json();
  }

  async update(req, res) {
    // Check if user is admin
    const user = await User.findByPk(req.userId);
    if (!user.admin)
      return res
        .status(401)
        .json({ error: 'Current user is not administrator!' });

    // Run field validations
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Fails' });
    }

    return res.json();
  }

  async delete(req, res) {
    // Check if user is admin
    const user = await User.findByPk(req.userId);
    if (!user.admin)
      return res
        .status(401)
        .json({ error: 'Current user is not administrator!' });

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }
    await delivery.destroy();
    return res.status(200).send();
  }
}

export default new DeliveryController();
