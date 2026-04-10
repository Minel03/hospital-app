import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import BillingTable from './components/BillingTable';
import BillingModal from './components/BillingModal';
import BillingViewModal from './components/BillingViewModal';
import { Icons, useAppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';

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
  const { ReceiptText, FileEdit, CircleDollarSign, Clock, TrendingUp } = Icons;
  const { axios } = useAppContext();

  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

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
    services: [{ name: 'Consultation', amount: '', quantity: 1 }],
  });

  const fetchAll = async () => {
    const [inv, pat, doc, adm, appt, med] = await Promise.all([
      axios.get('/api/invoice/list'),
      axios.get('/api/patient/all'),
      axios.get('/api/doctor/list'),
      axios.get('/api/admission/list'),
      axios.get('/api/appointment/list'),
      axios.get('/api/pharmacy/inventory'),
    ]);
    if (inv.data.success) setInvoices(inv.data.invoices);
    if (pat.data.success) setPatients(pat.data.patients);
    if (doc.data.success) setDoctors(doc.data.doctors);
    if (adm.data.success) setAdmissions(adm.data.admissions);
    if (appt.data.success) setAppointments(appt.data.appointments);
    if (med.data.success) setMedicines(med.data.medicines || []);
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

  const handleAutoCalculate = async () => {
    if (!formData.patient) return toast.error('Please select a patient first');
    try {
      const { data } = await axios.get(
        `/api/invoice/auto-calculate/${formData.patient}`
      );
      if (data.success) {
        if (data.billingItems.length === 0) {
          toast.info('No auto-billable items found for this patient.');
          return;
        }

        const newServices = data.billingItems.map((item) => ({
          name: item.name,
          amount: item.amount,
          labTest: item.labTest || null,
          quantity: item.quantity || 1,
          details: item.details || '',
        }));

        setFormData({
          ...formData,
          services: [...formData.services, ...newServices],
          admission: data.admission?._id || formData.admission,
        });

        toast.success(`Fetched ${newServices.length} billing items.`);
      }
    } catch (err) {
      toast.error('Failed to auto-calculate bill');
    }
  };

  const openView = (invoice) => {
    setViewInvoice(invoice);
    setShowViewModal(true);
  };

  const handlePrint = (invoice) => {
    if (!invoice) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice #${invoice._id.slice(-6).toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2563EB; text-align: center; }
          h3 { text-align: center; color: #555; }
          .section { margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          .total { text-align: right; font-weight: bold; }
          .status { padding: 4px 8px; color: white; border-radius: 4px; }
          .Paid { background-color: #16A34A; }
          .Pending { background-color: #CA8A04; }
          .Draft { background-color: #6B7280; }
        </style>
      </head>
      <body>
        <h1>MEDICAL INVOICE</h1>
        <h3>HealthCare Management System</h3>
        <p><strong>Invoice #:</strong> ${invoice._id.slice(-6).toUpperCase()}</p>
        <p><strong>Date Issued:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status}</span></p>

        <div class="section">
          <h4>Billed To:</h4>
          <p>${invoice.patient?.name || 'N/A'}</p>
        </div>

        <div class="section">
          <h4>Doctor:</h4>
          <p>${invoice.doctor?.name || 'N/A'}</p>
        </div>

        <div class="section">
          <h4>Services:</h4>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.services
                .map(
                  (s) => `<tr>
                    <td>${s.name}</td>
                    <td>$${parseFloat(s.amount).toLocaleString()}</td>
                  </tr>`,
                )
                .join('')}
            </tbody>
          </table>
          <p class="total">TOTAL: $${invoice.totalAmount.toLocaleString()}</p>
        </div>

        <div class="section">
          <p style="text-align:center; color:#999;">Thank you for choosing our healthcare services.</p>
          <p style="text-align:center; color:#999;">For inquiries, please contact billing@healthcare.com</p>
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    // Automatically close after printing or cancelling
    printWindow.onafterprint = () => {
      printWindow.close();
    };

    printWindow.print();
  };

  const handleDownload = (invoice) => {
    if (!invoice) return;

    // Prepare the same HTML as the print view
    const htmlContent = `
    <html>
      <head>
        <title>Invoice #${invoice._id.slice(-6).toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2563EB; text-align: center; }
          h3 { text-align: center; color: #555; }
          .section { margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          .total { text-align: right; font-weight: bold; }
          .status { padding: 4px 8px; color: white; border-radius: 4px; }
          .Paid { background-color: #16A34A; }
          .Pending { background-color: #CA8A04; }
          .Draft { background-color: #6B7280; }
        </style>
      </head>
      <body>
        <h1>MEDICAL INVOICE</h1>
        <h3>HealthCare Management System</h3>
        <p><strong>Invoice #:</strong> ${invoice._id.slice(-6).toUpperCase()}</p>
        <p><strong>Date Issued:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status}</span></p>

        <div class="section">
          <h4>Billed To:</h4>
          <p>${invoice.patient?.name || 'N/A'}</p>
        </div>

        <div class="section">
          <h4>Doctor:</h4>
          <p>${invoice.doctor?.name || 'N/A'}</p>
        </div>

        <div class="section">
          <h4>Services:</h4>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.services
                .map(
                  (s) => `<tr>
                    <td>${s.name}</td>
                    <td>$${parseFloat(s.amount).toLocaleString()}</td>
                  </tr>`,
                )
                .join('')}
            </tbody>
          </table>
          <p class="total">TOTAL: $${invoice.totalAmount.toLocaleString()}</p>
        </div>

        <div class="section">
          <p style="text-align:center; color:#999;">Thank you for choosing our healthcare services.</p>
          <p style="text-align:center; color:#999;">For inquiries, please contact billing@healthcare.com</p>
        </div>
      </body>
    </html>
  `;

    // Load html2pdf dynamically if not already loaded
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => generatePDF(htmlContent, invoice);
      document.body.appendChild(script);
    } else {
      generatePDF(htmlContent, invoice);
    }

    function generatePDF(content, invoice) {
      const container = document.createElement('div');
      container.innerHTML = content;
      document.body.appendChild(container);

      window
        .html2pdf()
        .set({
          margin: 10,
          filename: `invoice-${invoice._id.slice(-6).toUpperCase()}.pdf`,
          html2canvas: { scale: 2 },
        })
        .from(container)
        .save()
        .finally(() => document.body.removeChild(container));
    }
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
      services: [{ name: 'Consultation', amount: '', quantity: 1 }],
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
      services: [...formData.services, { name: 'Consultation', amount: '', quantity: 1 }],
    });
  const removeService = (i) =>
    setFormData({
      ...formData,
      services: formData.services.filter((_, idx) => idx !== i),
    });
  const updateService = (i, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[i] = { ...updated[i], [field]: value };
      return { ...prev, services: updated };
    });
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
      icon: ReceiptText,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Draft',
      value: invoices.filter((i) => i.status === 'Draft').length,
      icon: FileEdit,
      bgColor: 'bg-gray-50 dark:bg-gray-900/30',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Paid',
      value: invoices.filter((i) => i.status === 'Paid').length,
      icon: CircleDollarSign,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending',
      value: invoices.filter((i) => i.status === 'Pending').length,
      icon: Clock,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Total Revenue',
      value: `$${invoices
        .filter((i) => i.status === 'Paid')
        .reduce((s, i) => s + i.totalAmount, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <PageHeader
        title='Financial Billing'
        subtitle='Manage patient invoices, payments, and revenue records'
        buttonLabel='New Invoice'
        onButtonClick={openAdd}
        stats={stats}
      />

      <SearchBar
        placeholder='Search by patient, ID, status...'
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <BillingTable
        filtered={filtered}
        handleDelete={handleDelete}
        handleDownload={handleDownload}
        handleMarkPaid={handleMarkPaid}
        openEdit={openEdit}
        openView={openView}
        handlePrint={handlePrint}
      />

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
        medicines={medicines}
        handleAutoCalculate={handleAutoCalculate}
      />

      <BillingViewModal
        invoice={viewInvoice}
        showModal={showViewModal}
        setShowModal={setShowViewModal}
      />
    </div>
  );
};

export default Billing;
