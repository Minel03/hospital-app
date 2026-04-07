import React, { useEffect, useState } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Select from 'react-select';
import BillingHeader from './components/BillingHeader';
import BillingSearch from './components/BillingSearch';
import BillingTable from './components/BillingTable';
import BillingModal from './components/BillingModal';

const SERVICE_TYPES = [
  'Consultation',
  'Surgery',
  'Laboratory',
  'Imaging',
  'Pharmacy',
  'Room & Board',
  'Emergency',
];

const Billing = () => {
  const {
    Search,
    Edit,
    Trash,
    Download,
    Check,
    ReceiptText,
    FileEdit,
    CircleDollarSign,
    Clock,
    TrendingUp,
  } = Icons;
  const { axios } = useAppContext();

  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    admission: null,
    appointment: null,
    dueDate: '',
    status: 'Pending',
    services: [{ name: 'Consultation', amount: '' }],
  });

  const fetchAll = async () => {
    const [inv, pat, doc, adm, appt] = await Promise.all([
      axios.get('/api/invoice/list'),
      axios.get('/api/patient/all'),
      axios.get('/api/doctor/list'),
      axios.get('/api/admission/list'),
      axios.get('/api/appointment/list'),
    ]);
    if (inv.data.success) setInvoices(inv.data.invoices);
    if (pat.data.success) setPatients(pat.data.patients);
    if (doc.data.success) setDoctors(doc.data.doctors);
    if (adm.data.success) setAdmissions(adm.data.admissions);
    if (appt.data.success) setAppointments(appt.data.appointments);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const totalAmount = formData.services.reduce(
    (sum, s) => sum + (parseFloat(s.amount) || 0),
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        admission: formData.admission || null,
        appointment: formData.appointment || null,
      };
      if (mode === 'add') {
        const { data } = await axios.post('/api/invoice/add', payload);
        if (data.success) {
          toast.success(data.message);
          fetchAll();
          setShowModal(false);
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post('/api/invoice/update', {
          invoiceId: selectedInvoice._id,
          ...payload,
        });
        if (data.success) {
          toast.success(data.message);
          fetchAll();
          setShowModal(false);
        } else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    const { data } = await axios.post('/api/invoice/delete', { invoiceId: id });
    if (data.success) {
      toast.success(data.message);
      fetchAll();
    }
  };

  const handleMarkPaid = async (id) => {
    const { data } = await axios.post('/api/invoice/mark-paid', {
      invoiceId: id,
    });
    if (data.success) {
      toast.success(data.message);
      fetchAll();
    }
  };

  const handleDownload = (invoice) => {
    // Dynamically load jsPDF from CDN
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // ── Header ──
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAL INVOICE', pageWidth / 2, 18, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('HealthCare Management System', pageWidth / 2, 28, {
        align: 'center',
      });
      doc.text(
        `Invoice #${invoice._id.slice(-6).toUpperCase()}`,
        pageWidth / 2,
        36,
        { align: 'center' },
      );

      // ── Reset color ──
      doc.setTextColor(30, 30, 30);

      // ── Invoice Meta ──
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Date Issued: ${new Date(invoice.createdAt).toLocaleDateString()}`,
        14,
        52,
      );
      doc.text(
        `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
        14,
        59,
      );

      // Status badge
      const statusColor =
        invoice.status === 'Paid'
          ? [22, 163, 74]
          : invoice.status === 'Pending'
            ? [202, 138, 4]
            : [220, 38, 38];
      doc.setFillColor(...statusColor);
      doc.roundedRect(pageWidth - 50, 48, 36, 10, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.status.toUpperCase(), pageWidth - 32, 55, {
        align: 'center',
      });

      // ── Divider ──
      doc.setDrawColor(220, 220, 220);
      doc.line(14, 65, pageWidth - 14, 65);

      // ── Patient & Doctor Info ──
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('BILLED TO', 14, 75);
      doc.text('DOCTOR', pageWidth / 2, 75);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(invoice.patient?.name || 'N/A', 14, 83);
      doc.text(invoice.doctor?.name || 'N/A', pageWidth / 2, 83);

      if (invoice.admission) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Admission: ${invoice.admission?.patient?.name || invoice.admission?._id?.slice(-6) || 'N/A'}`,
          14,
          90,
        );
      }
      if (invoice.appointment) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Appointment: ${new Date(invoice.appointment?.date || '').toLocaleDateString() || 'N/A'}`,
          pageWidth / 2,
          90,
        );
      }

      // ── Services Table Header ──
      const tableTop = 102;
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(14, tableTop - 6, pageWidth - 28, 10, 'F');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('SERVICE', 18, tableTop);
      doc.text('AMOUNT', pageWidth - 18, tableTop, { align: 'right' });

      // ── Services Rows ──
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let y = tableTop + 10;
      invoice.services.forEach((s, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(14, y - 5, pageWidth - 28, 9, 'F');
        }
        doc.setTextColor(30, 30, 30);
        doc.text(s.name, 18, y);
        doc.text(
          `$${parseFloat(s.amount).toLocaleString()}`,
          pageWidth - 18,
          y,
          { align: 'right' },
        );
        y += 10;
      });

      // ── Total ──
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, pageWidth - 14, y);
      y += 8;
      doc.setFillColor(37, 99, 235);
      doc.rect(pageWidth - 80, y - 6, 66, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TOTAL', pageWidth - 75, y + 2);
      doc.text(
        `$${invoice.totalAmount.toLocaleString()}`,
        pageWidth - 18,
        y + 2,
        { align: 'right' },
      );

      // ── Footer ──
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        'Thank you for choosing our healthcare services.',
        pageWidth / 2,
        270,
        { align: 'center' },
      );
      doc.text(
        'For inquiries, please contact billing@healthcare.com',
        pageWidth / 2,
        276,
        { align: 'center' },
      );

      doc.save(`invoice-${invoice._id.slice(-6).toUpperCase()}.pdf`);
    };
    document.head.appendChild(script);
  };

  const openAdd = () => {
    setMode('add');
    setSelectedInvoice(null);
    setFormData({
      patient: '',
      doctor: '',
      admission: null,
      appointment: null,
      dueDate: '',
      status: 'Pending',
      services: [{ name: 'Consultation', amount: '' }],
    });
    setShowModal(true);
  };

  const openEdit = (invoice) => {
    setMode('edit');
    setSelectedInvoice(invoice);
    setFormData({
      patient: invoice.patient?._id || '',
      doctor: invoice.doctor?._id || '',
      admission: invoice.admission?._id || '',
      appointment: invoice.appointment?._id || '',
      dueDate: invoice.dueDate?.slice(0, 10) || '',
      status: invoice.status,
      services: invoice.services,
    });
    setShowModal(true);
  };

  const addService = () =>
    setFormData({
      ...formData,
      services: [...formData.services, { name: 'Consultation', amount: '' }],
    });
  const removeService = (i) =>
    setFormData({
      ...formData,
      services: formData.services.filter((_, idx) => idx !== i),
    });
  const updateService = (i, field, value) => {
    const updated = [...formData.services];
    updated[i] = { ...updated[i], [field]: value };
    setFormData({ ...formData, services: updated });
  };

  const filtered = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.patient?.name?.toLowerCase().includes(q) ||
      inv._id?.toLowerCase().includes(q) ||
      inv.status?.toLowerCase().includes(q)
    );
  });

  const stats = [
    {
      label: 'Total Invoices',
      value: invoices.length,
      color: 'bg-blue-500',
      icon: ReceiptText,
    },
    {
      label: 'Draft',
      value: invoices.filter((i) => i.status === 'Draft').length,
      color: 'bg-gray-500',
      icon: FileEdit,
    },
    {
      label: 'Paid',
      value: invoices.filter((i) => i.status === 'Paid').length,
      color: 'bg-green-500',
      icon: CircleDollarSign,
    },
    {
      label: 'Pending',
      value: invoices.filter((i) => i.status === 'Pending').length,
      color: 'bg-yellow-500',
      icon: Clock,
    },
    {
      label: 'Total Revenue',
      value: `$${invoices
        .filter((i) => i.status === 'Paid')
        .reduce((s, i) => s + i.totalAmount, 0)
        .toLocaleString()}`,
      color: 'bg-purple-500',
      icon: TrendingUp,
    },
  ];

  return (
    <div className='p-8 space-y-6'>
      <BillingHeader
        openAdd={openAdd}
        stats={stats}
      />

      <BillingSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Table */}
      <BillingTable
        filtered={filtered}
        handleDelete={handleDelete}
        handleDownload={handleDownload}
        handleMarkPaid={handleMarkPaid}
        openEdit={openEdit}
      />

      {/* Modal */}
      <BillingModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        patients={patients}
        doctors={doctors}
        handleSubmit={handleSubmit}
        admissions={admissions}
        appointments={appointments}
        updateService={updateService}
        addService={addService}
        removeService={removeService}
        totalAmount={totalAmount}
        SERVICE_TYPES={SERVICE_TYPES}
      />
    </div>
  );
};

export default Billing;
