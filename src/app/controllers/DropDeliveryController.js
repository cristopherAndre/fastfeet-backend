import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DropDeliveryController {
  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    // Check if Deliveryman exists
    const deliveryman = await Deliveryman.findByPk(deliverymanId);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman doesnt exists' });
    }

    // Check if delivery exists
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery doesnt exists' });
    }

    // Check if delivery is not started
    if (delivery.start_date === null) {
      return res.status(400).json({ error: 'Delivery is not started' });
    }

    // Check if delivery is ended already
    if (delivery.end_date !== null) {
      return res.status(400).json({ error: 'Delivery already ended' });
    }

    // Check if delivery is canceled
    if (delivery.canceled_at !== null) {
      res.status(401).json({ error: 'Delivery canceled.' });
    }

    const currentDate = new Date();
    await delivery.update({ end_date: currentDate });
    return res.status(200).json();
  }
}
export default new DropDeliveryController();
