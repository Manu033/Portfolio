import PDFDocument from 'pdfkit'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const MAINTENANCE_LABELS = {
  OIL_CHANGE:      'Cambio de aceite',
  TIRE_CHANGE:     'Cambio de neumáticos',
  ALIGNMENT:       'Alineado',
  BALANCING:       'Balanceado',
  BELT_CHANGE:     'Cambio de correa',
  BRAKE_SERVICE:   'Service de frenos',
  FILTER_CHANGE:   'Cambio de filtros',
  SPARK_PLUGS:     'Bujías',
  BATTERY:         'Batería',
  SUSPENSION:      'Suspensión',
  TRANSMISSION:    'Transmisión',
  COOLING_SYSTEM:  'Sistema de refrigeración',
  ELECTRICAL:      'Sistema eléctrico',
  GENERAL_SERVICE: 'Service general',
  OTHER:           'Otro',
}

export const generateMaintenancePDF = (car, maintenances, outputStream) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  doc.pipe(outputStream)

  // Header
  doc
    .fontSize(22)
    .fillColor('#1e40af')
    .text('Auto Control', { align: 'center' })
  doc
    .fontSize(12)
    .fillColor('#6b7280')
    .text('Historial de mantenimientos', { align: 'center' })
  doc.moveDown()

  // Car info box
  doc
    .roundedRect(50, doc.y, doc.page.width - 100, 80, 8)
    .fillAndStroke('#eff6ff', '#bfdbfe')

  const boxTop = doc.y + 12
  doc
    .fontSize(16)
    .fillColor('#1e3a8a')
    .text(`${car.brand} ${car.model} ${car.year}`, 65, boxTop)
  doc
    .fontSize(11)
    .fillColor('#374151')
    .text(`Patente: ${car.licensePlate}`, 65, boxTop + 26)
  if (car.notes) {
    doc.text(`Notas: ${car.notes}`, 65, boxTop + 42)
  }

  doc.moveDown(4)

  // Stats
  const totalCost = maintenances.reduce((acc, m) => acc + (parseFloat(m.cost) || 0), 0)
  doc
    .fontSize(10)
    .fillColor('#6b7280')
    .text(
      `Total de mantenimientos: ${maintenances.length}   |   Costo total: $${totalCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}   |   Generado: ${format(new Date(), "dd/MM/yyyy", { locale: es })}`,
      { align: 'center' }
    )

  doc.moveDown()
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#e5e7eb').stroke()
  doc.moveDown()

  // Maintenance list
  for (const m of maintenances) {
    if (doc.y > doc.page.height - 150) doc.addPage()

    const dateStr = format(new Date(m.date), "dd 'de' MMMM 'de' yyyy", { locale: es })
    const typeLabel = MAINTENANCE_LABELS[m.type] || m.type

    doc
      .fontSize(13)
      .fillColor('#1e40af')
      .text(`${typeLabel}`, { continued: true })
      .fillColor('#6b7280')
      .fontSize(10)
      .text(`  —  ${dateStr}`)

    if (m.place || m.mechanic) {
      doc
        .fontSize(10)
        .fillColor('#374151')
        .text([m.place, m.mechanic].filter(Boolean).join(' · '))
    }

    if (m.description) {
      doc
        .fontSize(10)
        .fillColor('#4b5563')
        .text(m.description, { indent: 10 })
    }

    if (m.cost) {
      doc
        .fontSize(10)
        .fillColor('#059669')
        .text(`Costo: $${parseFloat(m.cost).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, { indent: 10 })
    }

    if (m.nextMaintenanceDate) {
      const nextStr = format(new Date(m.nextMaintenanceDate), "dd/MM/yyyy")
      doc
        .fontSize(10)
        .fillColor('#d97706')
        .text(`Próximo mantenimiento: ${nextStr}`, { indent: 10 })
    }

    doc.moveDown(0.5)
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#f3f4f6').stroke()
    doc.moveDown(0.5)
  }

  // Footer
  const pageRange = doc.bufferedPageRange()
  for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
    doc.switchToPage(i)
    doc
      .fontSize(8)
      .fillColor('#9ca3af')
      .text(
        `Auto Control · Página ${i + 1} de ${pageRange.count}`,
        50,
        doc.page.height - 40,
        { align: 'center', width: doc.page.width - 100 }
      )
  }

  doc.end()
}
