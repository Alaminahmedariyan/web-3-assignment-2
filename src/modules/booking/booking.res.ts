const formatBookingResponse = (res: any, vehicle?: any, customer?: any) => {
  const formatted: any = {
    id: res.id,
    customer_id: res.customer_id,
    vehicle_id: res.vehicle_id,
    rent_start_date: new Date(res.rent_start_date).toISOString().split('T')[0],
    rent_end_date: new Date(res.rent_end_date).toISOString().split('T')[0],
    total_price: Number(res.total_price),
    status: res.status,
  };

  if (customer) {
    formatted.customer = {
      name: customer.name || res.customer_name,
      email: customer.email || res.customer_email,
    };
  }

  if (vehicle) {
    formatted.vehicle = {
      vehicle_name: vehicle.vehicle_name || res.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price ? Number(vehicle.daily_rent_price) : undefined,
      registration_number: vehicle.registration_number || res.registration_number,
      availability_status: vehicle.availability_status
    };
  }

  return formatted;
};
export default formatBookingResponse;