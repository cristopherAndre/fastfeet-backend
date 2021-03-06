import { Op } from 'sequelize';
import properties from '../../config/properties';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliverymanDeliveredController {
  async index(req, res) {
    const { deliverymanId } = req.params;
    const { page = 1 } = req.query;

    // Get properties from app.properties file
    const limit = Number(properties.get('pagination.limit.result'));

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exists' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        end_date: { [Op.ne]: null },
        canceled_at: { [Op.eq]: null },
      },
      limit,
      offset: (page - 1) * limit,
      order: ['id'],
      attributes: [
        'id',
        'deliveryman_id',
        'product',
        // 'status',
        'start_date',
        'end_date',
        'canceled_at',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'state',
            'city',
            'street',
            'number',
            'complement',
            'cep',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(deliveries);
  }
}
export default new DeliverymanDeliveredController();
