'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

interface DryCleaningItem {
  id: string;
  name: string;
  price: number | string;
  category: 'clothing' | 'bedding';
}

interface SelectedItem {
  id: string;
  quantity: number;
}

export function BookingPageComponent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const services = [
    { id: 'dry-cleaning', name: 'Dry Cleaning', showPrice: false },
    { id: 'key-cutting', name: 'Key Cutting', showPrice: false },
    { id: 'alterations', name: 'Alterations', isRedirect: true },
  ]

  const dryCleaningItems: DryCleaningItem[] = [
    // Clothing Items
    { id: 'tie', name: 'Tie', price: 6, category: 'clothing' },
    { id: 'scarf', name: 'Scarf', price: 10, category: 'clothing' },
    { id: 'skirt', name: 'Skirt', price: 'From $12', category: 'clothing' },
    { id: 'pleated-skirt', name: 'Pleated Skirt', price: 'From $15', category: 'clothing' },
    { id: 'jacket', name: 'Jacket', price: 17, category: 'clothing' },
    { id: 'suit-2pc', name: 'Suit (2 Piece)', price: 27, category: 'clothing' },
    { id: 'silk-shirt', name: 'Silk Shirt', price: 15, category: 'clothing' },
    { id: 'blouse', name: 'Blouse', price: 12, category: 'clothing' },
    { id: 'shorts', name: 'Shorts', price: 10, category: 'clothing' },
    { id: 'trousers', name: 'Trousers', price: 12, category: 'clothing' },
    { id: 'wedding-dress', name: 'Wedding Dress', price: 'To be advised', category: 'clothing' },
    { id: 'ball-gown', name: 'Ball Gown', price: 'From $55', category: 'clothing' },
    { id: 'dress', name: 'Dress', price: 'From $25', category: 'clothing' },
    { id: 'coat', name: 'Coat', price: 'From $20', category: 'clothing' },
    { id: 'jumper-cardigan', name: 'Jumper / Cardigan', price: 'From $13', category: 'clothing' },
    
    // Bedding Items
    { id: 'doona-single', name: 'Doona / Blanket - Single', price: 30, category: 'bedding' },
    { id: 'doona-double', name: 'Doona / Blanket - Double', price: 35, category: 'bedding' },
    { id: 'doona-queen', name: 'Doona / Blanket - Queen', price: 'From $40', category: 'bedding' },
    { id: 'doona-king', name: 'Doona / Blanket - King', price: 'From $50', category: 'bedding' },
    { id: 'doona-cover-queen', name: 'Doona Cover - Queen', price: 25, category: 'bedding' },
    { id: 'doona-cover-king', name: 'Doona Cover - King', price: 30, category: 'bedding' },
    { id: 'pillow', name: 'Pillow', price: 'From $15', category: 'bedding' },
    { id: 'pillow-case', name: 'Standard Pillow Case', price: 8, category: 'bedding' },
    { id: 'cushion-cover', name: 'Cushion Cover', price: 8, category: 'bedding' },
  ]

  const keyTypes = [
    { id: 'brass-key', name: 'Brass Key', price: 6 },
    { id: 'coloured-key', name: 'Coloured Key', price: 7 },
  ]

  const availableTimes = [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45'
  ]

  const getBasePrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    // Extract the number from strings like "From $12" or "To be advised"
    const match = price.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  const calculateTotal = useMemo(() => {
    return selectedItems.reduce((total, selectedItem) => {
      const item = dryCleaningItems.find(i => i.id === selectedItem.id);
      if (!item) {
        const keyType = keyTypes.find(i => i.id === selectedItem.id);
        if (!keyType) return total;
        return total + (keyType.price * selectedItem.quantity);
      }
      return total + (getBasePrice(item.price) * selectedItem.quantity);
    }, 0);
  }, [selectedItems, dryCleaningItems, keyTypes]);

  const getTotalItemCount = () => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service?.isRedirect) {
      router.push('/alterations');
      return;
    }
    setSelectedService(serviceId)
    setSelectedItems([])
    setStep(2)
  }

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(item => item.id === itemId)
      if (existingItem) {
        // If item exists, remove it
        return prev.filter(item => item.id !== itemId)
      }
      // If item doesn't exist, add it with quantity 1
      return [...prev, { id: itemId, quantity: 1 }]
    })
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    setSelectedItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change) // Ensure quantity doesn't go below 1
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    })
  }

  const isItemSelected = (itemId: string) => {
    return selectedItems.some(item => item.id === itemId)
  }

  const getItemQuantity = (itemId: string) => {
    return selectedItems.find(item => item.id === itemId)?.quantity || 0
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep(3)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Booking submitted:', { 
      selectedService, 
      selectedItems,
      selectedDate, 
      selectedTime 
    })
    router.push('/booking/confirmation')
  }

  const handleAddToCart = (item: any) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const existingItem = cartItems.find((i: any) => i.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        ...item,
        id: `${item.name}-${Date.now()}`,
        quantity: 1
      })
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }

  const handleViewCart = () => {
    router.push('/booking/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Service Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-4 rounded-lg border ${
                    selectedService === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  {service.price && !service.isRedirect && (
                    <div className="text-sm text-gray-500">From ${service.price}</div>
                  )}
                  {service.isRedirect && (
                    <div className="text-sm text-blue-500">Schedule Consultation</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dry Cleaning Items Selection */}
          {selectedService === 'dry-cleaning' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Items</h3>
                {selectedItems.length > 0 && (
                  <div className="text-lg font-semibold text-blue-600">
                    Total: ${calculateTotal.toFixed(2)}
                  </div>
                )}
              </div>
　
　
              {/* Clothing Items */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Clothing Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dryCleaningItems
                    .filter(item => item.category === 'clothing')
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          isItemSelected(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemSelected(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-3 flex-1">
                            <span className="block font-medium">{item.name}</span>
                            <span className="block text-sm text-gray-500">
                              {typeof item.price === 'number' ? `$${item.price}` : item.price}
                            </span>
                          </span>
                        </label>
                        {isItemSelected(item.id) && (
                          <div className="mt-2 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {getItemQuantity(item.id)}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Bedding Items */}
              <div>
                <h4 className="text-md font-medium mb-3">Bedding Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dryCleaningItems
                    .filter(item => item.category === 'bedding')
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          isItemSelected(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemSelected(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-3 flex-1">
                            <span className="block font-medium">{item.name}</span>
                            <span className="block text-sm text-gray-500">
                              {typeof item.price === 'number' ? `$${item.price}` : item.price}
                            </span>
                          </span>
                        </label>
                        {isItemSelected(item.id) && (
                          <div className="mt-2 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {getItemQuantity(item.id)}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Cutting Section */}
          {selectedService === 'key-cutting' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Key Cutting Services</h3>
                {selectedItems.length > 0 && (
                  <div className="text-lg font-semibold text-blue-600">
                    Total: ${calculateTotal.toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 italic mb-4">Only normal keys available.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyTypes.map((keyType) => (
                    <div
                      key={keyType.id}
                      className={`p-4 rounded-lg border ${
                        isItemSelected(keyType.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isItemSelected(keyType.id)}
                          onChange={() => handleItemSelect(keyType.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="ml-3 flex-1">
                          <span className="block font-medium">{keyType.name}</span>
                          <span className="block text-sm text-gray-500">
                            ${keyType.price}
                          </span>
                        </span>
                      </label>
                      {isItemSelected(keyType.id) && (
                        <div className="mt-2 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleQuantityChange(keyType.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">
                            {getItemQuantity(keyType.id)}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(keyType.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center space-x-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              {selectedItems.length > 0 && (
                <div className="text-lg font-semibold text-blue-600">
                  Total: ${calculateTotal.toFixed(2)}
                </div>
              )}
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>

          {/* Date and Time Selection */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Date and Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <select
                  onChange={(e) => handleTimeSelect(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>
                      {time.replace(':', ':')} {parseInt(time) < 12 ? 'AM' : 'PM'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
              <div className="space-y-4">
                <p>Service: {services.find(s => s.id === selectedService)?.name}</p>
                <div>
                  <p className="font-medium mb-2">Selected Items:</p>
                  <ul className="list-disc pl-5">
                    {selectedItems.map(selectedItem => {
                      const item = dryCleaningItems.find(i => i.id === selectedItem.id)
                      if (!item) {
                        const keyType = keyTypes.find(i => i.id === selectedItem.id);
                        if (!keyType) return null;
                        const itemTotal = keyType.price * selectedItem.quantity;
                        return (
                          <li key={selectedItem.id} className="flex justify-between items-center">
                            <span>
                              {keyType.name} (Quantity: {selectedItem.quantity})
                            </span>
                            <span className="text-gray-600">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </li>
                        )
                      }
                      const itemTotal = getBasePrice(item.price) * selectedItem.quantity;
                      return (
                        <li key={selectedItem.id} className="flex justify-between items-center">
                          <span>
                            {item.name} (Quantity: {selectedItem.quantity})
                          </span>
                          <span className="text-gray-600">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">${calculateTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <p>Date: {selectedDate}</p>
                <p>Time: {selectedTime}</p>
                <div className="relative">
                  <button
                    onClick={handleViewCart}
                    onMouseEnter={() => setShowDisclaimer(true)}
                    onMouseLeave={() => setShowDisclaimer(false)}
                    className="w-full mt-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <span>View Cart</span>
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                      {getTotalItemCount()} items - ${calculateTotal.toFixed(2)}
                    </span>
                  </button>
                  {showDisclaimer && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-amber-50 border border-amber-200 rounded-md shadow-lg text-sm text-amber-800">
                      <p className="mb-2"><strong>Important Notice:</strong></p>
                      <p>Please be aware that certain items, particularly those listed under bedding items, may have stains that cannot be fully removed during the dry cleaning process. This includes:</p>
                      <ul className="list-disc pl-4 mt-1 mb-2">
                        <li>Old or set-in stains</li>
                        <li>Bodily fluid stains</li>
                        <li>Certain types of dye or color transfers</li>
                      </ul>
                      <p>The effectiveness of stain removal can vary depending on the nature of the stain and the fabric type. We will make every effort to achieve the best possible results.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}