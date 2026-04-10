import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import BillingTable from './components/BillingTable';
import BillingModal from './components/BillingModal';
import BillingViewModal from './components/BillingViewModal';
import { Icons, useAppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
  const { axios, globalSettings, userData } = useAppContext();
  const canBilling = ['admin', 'accountant', 'receptionist'].includes(userData?.role);
  const canViewClinical = ['admin', 'doctor', 'nurse', 'receptionist', 'accountant', 'medtech'].includes(userData?.role);

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
    try {
      // Priority 1: Invoices, Patients, Doctors, Medicines (Crucial for Billing)
      const [inv, pat, doc, med] = await Promise.all([
        axios.get('/api/invoice/list'),
        axios.get('/api/patient/all'),
        axios.get('/api/doctor/list'),
        axios.get('/api/pharmacy/inventory'),
      ]);
      
      if (inv.data.success) setInvoices(inv.data.invoices);
      if (pat.data.success) setPatients(pat.data.patients);
      if (doc.data.success) setDoctors(doc.data.doctors);
      if (med.data.success) setMedicines(med.data.medicines || []);

      // Priority 2: Admissions and Appointments (Optional clinical context)
      if (canViewClinical) {
        try {
          const [adm, appt] = await Promise.all([
            axios.get('/api/admission/list'),
            axios.get('/api/appointment/list'),
          ]);
          if (adm.data.success) setAdmissions(adm.data.admissions);
          if (appt.data.success) setAppointments(appt.data.appointments);
        } catch (err) {
          console.warn('Optional clinical data could not be loaded for this role.');
        }
      }
    } catch (err) {
      console.error('Core billing data load failed:', err);
      toast.error('Failed to load core billing data.');
    }
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
        `/api/invoice/auto-calculate/${formData.patient}`,
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

  const getInvoiceTemplate = (invoice) => {
    const hospitalName =
      globalSettings?.hospitalName || 'Healthcare Management System';
    const address = globalSettings?.address || '123 Medical Plaza, Health City';
    const contact = globalSettings?.contactNumber || '(555) 123-4567';
    const email = globalSettings?.email || 'support@healthcare.ms';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${invoice._id.slice(-6).toUpperCase()}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          
          @page {
            size: A4;
            margin: 0;
          }

          body { 
            font-family: 'Inter', sans-serif; 
            padding: 40px; 
            color: #1f2937;
            line-height: 1.5;
            background: white;
          }
          
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .logo-circle {
            width: 40px;
            height: 40px;
            background: #2563eb !important;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            font-weight: 800;
            font-size: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .hospital-info h1 { 
            font-size: 20px; 
            font-weight: 800;
            margin: 0;
            color: #111827;
            letter-spacing: -0.025em;
            text-transform: uppercase;
          }
          
          .hospital-info p {
            font-size: 11px;
            color: #6b7280;
            margin: 4px 0 0 0;
          }
          
          .invoice-meta { text-align: right; }
          .invoice-meta h2 { 
            font-size: 32px; 
            font-weight: 800; 
            margin: 0; 
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          
          .info-block h4 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #9ca3af;
            margin-bottom: 8px;
            letter-spacing: 0.1em;
          }
          
          .info-block p {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin: 0;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .status-Paid { background: #d1fae5; color: #065f46; }
          .status-Pending { background: #fef3c7; color: #92400e; }
          .status-Overdue { background: #fee2e2; color: #991b1b; }
          
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th { 
            text-align: left; 
            font-size: 11px; 
            font-weight: 700; 
            text-transform: uppercase; 
            color: #6b7280;
            padding: 12px 16px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          }
          
          td { padding: 16px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
          .amount-col { text-align: right; font-weight: 600; }
          
          .summary {
            margin-left: auto;
            width: 250px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
          }
          
          .total-row {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px solid #2563eb;
            font-size: 16px;
            font-weight: 800;
            color: #2563eb;
          }
          
          .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #f3f4f6;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-info">
            <div class="brand">
              <div class="logo-circle">${hospitalName.charAt(0)}</div>
              <h1>${hospitalName}</h1>
            </div>
            <p>${address}</p>
            <p>Tel: ${contact} | ${email}</p>
          </div>
          <div class="invoice-meta">
            <h2>Invoice</h2>
            <p style="margin: 8px 0 0 0; font-weight: 600; font-size: 13px;">#${invoice._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        <div class="grid">
          <div class="info-block">
            <h4>Billed To</h4>
            <p>${invoice.patient?.name || 'N/A'}</p>
            <p style="font-weight: 400; font-size: 12px; color: #6b7280; margin-top: 4px;">ID: ${invoice.patient?._id?.slice(-8) || 'N/A'}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h4>Billing Date</h4>
            <p>${new Date(invoice.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            <h4 style="margin-top: 16px;">Invoice Status</h4>
            <span class="status-badge status-${invoice.status}">${invoice.status}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Service Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.services
              .map(
                (s) => `<tr>
                  <td>
                    <div style="font-weight: 600;">${s.name}</div>
                    ${s.details ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${s.details}</div>` : ''}
                  </td>
                  <td class="amount-col">$${parseFloat(s.amount).toLocaleString()}</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${invoice.totalAmount.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <div class="summary-row total-row">
            <span>Total Amount</span>
            <span>$${invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <p>Please include the invoice number on all payments.</p>
          <p>Thank you for choosing ${hospitalName}.</p>
          <p style="margin-top: 20px; font-weight: 600;">Authorized Signature: _______________________</p>
        </div>
      </body>
    </html>
    `.trim();
  };

  const handlePrint = (invoice) => {
    if (!invoice) return;
    try {
      const htmlContent = getInvoiceTemplate(invoice);
      
      // Use hidden iframe to avoid opening new tab
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();

      iframe.contentWindow.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        // Remove iframe after printing dialog closes
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 1000);
      };
    } catch (err) {
      console.error('Print Error:', err);
      toast.error('Could not trigger print dialog.');
    }
  };

  const handleDownload = (invoice) => {
    if (!invoice) return;

    const toastId = toast.loading('Generating professional PDF...');

    const generatePDF = async () => {
      try {
        const htmlContent = getInvoiceTemplate(invoice);
        const fileName = `invoice-${invoice._id.slice(-6).toUpperCase()}.pdf`;
        
        // --- TRUE ISOLATION TECHNIQUE ---
        // We create a "sandboxed" document inside an iframe.
        // We inject the library and the template TOGETHER.
        // By running html2pdf INSIDE the iframe, it NEVER sees 
        // the parent's Tailwind v4 colors that cause the crash.
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '210mm';
        iframe.style.height = '1000px';
        iframe.style.left = '-10000px'; 
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const isolatedHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
              <style>
                body { margin: 0; padding: 0; background: white; }
              </style>
            </head>
            <body>
              ${htmlContent}
              <script>
                // This script runs INSIDE the iframe context
                window.onload = async () => {
                  try {
                    // Wait a tiny bit for extra safety
                    await new Promise(r => setTimeout(r, 800));
                    
                    const opt = {
                      margin: [10, 10, 10, 10],
                      filename: '${fileName}',
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { 
                        scale: 2, 
                        useCORS: true,
                        letterRendering: true,
                        logging: false
                      },
                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };

                    // Run the engine in this isolated space
                    await html2pdf().set(opt).from(document.body).save();
                    window.parent.postMessage({ type: 'PDF_SUCCESS' }, '*');
                  } catch (e) {
                    window.parent.postMessage({ type: 'PDF_ERROR', error: e.message }, '*');
                  }
                };
              </script>
            </body>
          </html>
        `;

        // Listen for completion from the iframe
        const messageHandler = (event) => {
          if (event.data.type === 'PDF_SUCCESS') {
            toast.update(toastId, {
              render: 'PDF Downloaded successfully!',
              type: 'success',
              isLoading: false,
              autoClose: 2000,
            });
            cleanup();
          } else if (event.data.type === 'PDF_ERROR') {
            toast.update(toastId, {
              render: 'Download failed. Please use Print.',
              type: 'error',
              isLoading: false,
              autoClose: 3000,
            });
            cleanup();
          }
        };

        const cleanup = () => {
          window.removeEventListener('message', messageHandler);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        };

        window.addEventListener('message', messageHandler);

        // Inject the isolated document
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(isolatedHTML);
        iframeDoc.close();

      } catch (err) {
        console.error('PDF Error:', err);
        toast.update(toastId, {
          render: 'Optimization failed.',
          type: 'error',
          isLoading: false,
          autoClose: 2000,
        });
      }
    };

    // Trigger the flow
    generatePDF();
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
      services: [
        ...formData.services,
        { name: 'Consultation', amount: '', quantity: 1 },
      ],
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
        buttonLabel={canBilling ? 'New Invoice' : null}
        onButtonClick={canBilling ? openAdd : null}
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
        userData={userData}
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
        onPrint={() => handlePrint(viewInvoice)}
        onDownload={() => handleDownload(viewInvoice)}
      />
    </div>
  );
};

export default Billing;
