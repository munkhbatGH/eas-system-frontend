'use client'

import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { useState } from 'react'

interface Field {
  name: string
  label: string
  type: string
  required?: boolean
  options?: string[]
}

interface DynamicFormProps {
  title: string
  fields: Field[]
  onSubmit?: (data: Record<string, any>) => void
}

export default function DynamicForm({ title, fields, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    console.log("Submitted data:", formData)
  }

  return (
    <Form onSubmit={handleSubmit} className="w-full p-6">
      {/* <h2 className="text-2xl font-semibold">{title}</h2> */}
      
      {fields.map(field => (
        <div key={field.name} className="w-full flex flex-col">
          <label htmlFor={field.name}>{field.label}</label>

          {field.type === 'select' ? (
            <select
              id={field.name}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <Input
              id={field.name}
              type={field.type}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              className="p-2"
            />
          )}
        </div>
      ))}

      <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </Button>
    </Form>
  )
}
