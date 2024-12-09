'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import ServiceSelection from './components/ServiceSelection'
import DryCleaningSelection from './components/DryCleaningSelection'
import KeyCuttingSelection from './components/KeyCuttingSelection'
import DateTimeSelection from './components/DateTimeSelection'
import Summary from './components/Summary'
import GuestInformation from './components/GuestInformation'

interface SelectedItem {
  id: string;
  quantity: number;
}

const BookingPageComponent: React.FC = () => {
  const router = useRouter()

  // State management
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  const handleServiceSelect = (serviceId: string) => {
    if (serviceId === 'alterations') {
      router.push('/alterations')
      return
    }
    setSelectedService(serviceId)
    setSelectedItems([])
    setStep(2)
  }

  const handleBooking = () => {
    // Store booking details in localStorage
    const bookingDetails = {
      email: guestEmail,
      name: guestName,
      phone: guestPhone,
      service: selectedService,
      items: selectedItems,
      date: selectedDate,
      time: selectedTime,
    }
    localStorage.setItem('guestBooking', JSON.stringify(bookingDetails))
    router.push('/booking/guest-confirmation')
  }

  // Function to render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ServiceSelection
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
          />
        )
      case 2:
        if (selectedService === 'dry-cleaning') {
          return (
            <DryCleaningSelection
              selectedItems={selectedItems}
              onSelectedItemsChange={setSelectedItems}
              onStepChange={setStep}
            />
          )
        } else if (selectedService === 'key-cutting') {
          return (
            <KeyCuttingSelection
              selectedItems={selectedItems}
              onSelectedItemsChange={setSelectedItems}
              onStepChange={setStep}
            />
          )
        }
        break
      case 3:
        return (
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onStepChange={setStep}
          />
        )
      case 4:
        return (
          <GuestInformation
            guestEmail={guestEmail}
            guestName={guestName}
            guestPhone={guestPhone}
            onGuestEmailChange={setGuestEmail}
            onGuestNameChange={setGuestName}
            onGuestPhoneChange={setGuestPhone}
            onContinue={() => setStep(5)}
          />
        )
      case 5:
        return (
          <Summary
            selectedService={selectedService}
            selectedItems={selectedItems}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            guestEmail={guestEmail}
            onSubmit={handleBooking}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Book a Service - Lammy's Multi Services</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Step {step} of 5
              </div>
            </div>
          </div>

          {/* Current step content */}
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

export default BookingPageComponent
