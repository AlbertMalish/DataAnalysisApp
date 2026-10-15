import React, { useState } from 'react';
import { KoboFieldQuestion, KoboSubmission } from '../../types';
import { 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  Send, 
  FileSpreadsheet, 
  Code, 
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const KoboCollectSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'xlsform' | 'submissions'>('survey');
  
  // Simulated form questions (Humanitarian WASH & Nutrition Assessment)
  const questions: KoboFieldQuestion[] = [
    {
      name: 'surveyor_name',
      type: 'text',
      label: '1. Name of Field Enumerator / Surveyor',
      hint: 'Enter your full name for auditing',
      required: true
    },
    {
      name: 'settlement_zone',
      type: 'select_one',
      label: '2. Settlement Zone / Camp Location',
      hint: 'Select the operational zone',
      required: true,
      choices: [
        { name: 'zone_alpha', label: 'Zone Alpha (Sector North)' },
        { name: 'zone_beta', label: 'Zone Beta (Sector East)' },
        { name: 'zone_gamma', label: 'Zone Gamma (Transit Center)' },
        { name: 'zone_delta', label: 'Zone Delta (Extension)' }
      ]
    },
    {
      name: 'household_size',
      type: 'integer',
      label: '3. Number of persons currently sleeping in shelter',
      hint: 'Must be between 1 and 30 persons',
      required: true,
      constraint: '. >= 1 and . <= 30',
      constraintMessage: 'Error: Household size must be between 1 and 30 persons.'
    },
    {
      name: 'primary_water_source',
      type: 'select_one',
      label: '4. What is the primary source of drinking water?',
      required: true,
      choices: [
        { name: 'borehole', label: 'Protected Deep Borehole' },
        { name: 'piped_tap', label: 'Piped Public Water Tap' },
        { name: 'water_truck', label: 'Emergency Water Trucking' },
        { name: 'surface_river', label: 'Unprotected River / Pond' }
      ]
    },
    {
      name: 'water_fetch_time',
      type: 'integer',
      label: '5. Round-trip collection time in minutes',
      hint: 'Includes walking to source, queuing, and returning',
      required: true
    },
    {
      name: 'child_malnourished_screening',
      type: 'select_one',
      label: '6. Are there any children under 5 years showing signs of acute malnutrition?',
      hint: 'Triggers clinical MUAC measurement if Yes',
      required: true,
      choices: [
        { name: 'yes', label: 'Yes - Child present with edema or wasting' },
        { name: 'no', label: 'No - All children appear nourished' }
      ]
    },
    // CONDITIONAL SKIP QUESTION
    {
      name: 'muac_score_mm',
      type: 'integer',
      label: '7. [Skip Triggered] Child Mid-Upper Arm Circumference (MUAC in mm)',
      hint: 'Red (< 115mm = Severe), Yellow (115-124mm = Moderate), Green (>= 125mm)',
      required: true,
      relevant: "${child_malnourished_screening} = 'yes'",
      constraint: '. >= 60 and . <= 220',
      constraintMessage: 'MUAC measurement must be between 60mm and 220mm.'
    },
    {
      name: 'gps_location',
      type: 'geopoint',
      label: '8. Shelter GPS Coordinates',
      hint: 'Tap "Record GPS" to simulate field satellite fix',
      required: true
    }
  ];

  // Current in-progress form responses
  const [formData, setFormData] = useState<Record<string, any>>({
    surveyor_name: 'Albert Malish',
    settlement_zone: 'zone_alpha',
    household_size: 6,
    primary_water_source: 'borehole',
    water_fetch_time: 25,
    child_malnourished_screening: 'yes',
    muac_score_mm: 112,
    gps_location: '3.1245° N, 31.8901° E (accuracy ±3.2m)'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<KoboSubmission[]>([
    {
      id: 'KOB-9001',
      submittedAt: '2024-04-10 09:14',
      data: {
        surveyor_name: 'Albert Malish',
        settlement_zone: 'Zone Alpha',
        household_size: 6,
        primary_water_source: 'Protected Deep Borehole',
        water_fetch_time: 25,
        child_malnourished_screening: 'Yes',
        muac_score_mm: 112,
        gps_location: '3.1245, 31.8901'
      }
    },
    {
      id: 'KOB-9002',
      submittedAt: '2024-04-10 10:22',
      data: {
        surveyor_name: 'Sarah Connor',
        settlement_zone: 'Zone Beta',
        household_size: 8,
        primary_water_source: 'Emergency Water Trucking',
        water_fetch_time: 60,
        child_malnourished_screening: 'No',
        muac_score_mm: 'N/A',
        gps_location: '3.1289, 31.8954'
      }
    }
  ]);

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSimulateGps = () => {
    setIsGpsLoading(true);
    setTimeout(() => {
      const lat = (3.12 + Math.random() * 0.03).toFixed(4);
      const lon = (31.88 + Math.random() * 0.04).toFixed(4);
      setFormData(prev => ({
        ...prev,
        gps_location: `${lat}° N, ${lon}° E (accuracy ±2.4m)`
      }));
      setIsGpsLoading(false);
    }, 700);
  };

  const handleInputChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    // Clear error
    if (formErrors[field]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate constraints
    if (formData.household_size < 1 || formData.household_size > 30) {
      errors.household_size = 'Household size must be between 1 and 30 persons.';
    }

    if (formData.child_malnourished_screening === 'yes') {
      const muac = Number(formData.muac_score_mm);
      if (!muac || muac < 60 || muac > 220) {
        errors.muac_score_mm = 'MUAC measurement must be between 60mm and 220mm.';
      }
    }

    if (!formData.gps_location) {
      errors.gps_location = 'Please record GPS coordinates before submitting.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save submission
    const newSub: KoboSubmission = {
      id: `KOB-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      data: { ...formData }
    };

    setSubmissions([newSub, ...submissions]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const exportSubmissionsCsv = () => {
    if (submissions.length === 0) return;
    const cols = Object.keys(submissions[0].data);
    let csv = ['id', 'submitted_at', ...cols].join(',') + '\n';
    submissions.forEach(s => {
      const row = [s.id, s.submittedAt, ...cols.map(c => `"${String(s.data[c] ?? '').replace(/"/g, '""')}"`)];
      csv += row.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kobo_survey_submissions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/70 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Kobo Collect & ODK Field Engine</h2>
            <p className="text-xs text-slate-400">Offline Field Surveys, XLSForm Logic & CSV Export</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'survey' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Collect Data
          </button>
          <button
            onClick={() => setActiveTab('xlsform')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'xlsform' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            XLSForm Spec
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'submissions' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Records ({submissions.length})
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4">
        {/* COLLECT DATA INTERACTIVE MODE */}
        {activeTab === 'survey' && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            {/* Top Form Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">ODK Form ID: wash_nutr_v2.1</span>
                <h3 className="text-base font-bold text-white">WASH & Child Nutrition Field Assessment</h3>
                <p className="text-xs text-slate-400">Simulating Android Kobo Collect 2026</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Form finalized and saved! Added to field submissions queue for analysis.</span>
              </div>
            )}

            {/* Questions Stack */}
            <div className="space-y-3">
              {/* Question 1: Text */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  {questions[0].label} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.surveyor_name || ''}
                  onChange={(e) => handleInputChange('surveyor_name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              {/* Question 2: select_one Zone */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  {questions[1].label} <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {questions[1].choices?.map(c => (
                    <label
                      key={c.name}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                        formData.settlement_zone === c.name
                          ? 'bg-teal-950/50 border-teal-500 text-teal-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="settlement_zone"
                        checked={formData.settlement_zone === c.name}
                        onChange={() => handleInputChange('settlement_zone', c.name)}
                        className="text-teal-500 focus:ring-0"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3: Household size (with constraint) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-200">
                    {questions[2].label} <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-teal-400 font-mono">constraint: . &gt;= 1 and . &lt;= 30</span>
                </div>
                <input
                  type="number"
                  value={formData.household_size || ''}
                  onChange={(e) => handleInputChange('household_size', parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
                {formErrors.household_size && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{formErrors.household_size}</span>
                  </p>
                )}
              </div>

              {/* Question 4: Primary water source */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  {questions[3].label} <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {questions[3].choices?.map(c => (
                    <label
                      key={c.name}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                        formData.primary_water_source === c.name
                          ? 'bg-teal-950/50 border-teal-500 text-teal-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="primary_water_source"
                        checked={formData.primary_water_source === c.name}
                        onChange={() => handleInputChange('primary_water_source', c.name)}
                        className="text-teal-500 focus:ring-0"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 6: Malnutrition Screening */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  {questions[5].label} <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {questions[5].choices?.map(c => (
                    <label
                      key={c.name}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                        formData.child_malnourished_screening === c.name
                          ? 'bg-teal-950/50 border-teal-500 text-teal-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="child_malnourished_screening"
                        checked={formData.child_malnourished_screening === c.name}
                        onChange={() => handleInputChange('child_malnourished_screening', c.name)}
                        className="text-teal-500 focus:ring-0"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 7: CONDITIONAL SKIP QUESTION (MUAC) */}
              {formData.child_malnourished_screening === 'yes' ? (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-1.5 transition-all">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                      <span>{questions[6].label}</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">relevant: ${`{child_malnourished} = 'yes'`}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{questions[6].hint}</p>
                  <input
                    type="number"
                    value={formData.muac_score_mm || ''}
                    onChange={(e) => handleInputChange('muac_score_mm', parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="Enter MUAC in mm (e.g. 112)"
                  />
                  {formErrors.muac_score_mm && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{formErrors.muac_score_mm}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-[11px] text-slate-500 italic">
                  [Question 7 Skipped: Only revealed when Child Malnutrition = Yes via XLSForm skip logic]
                </div>
              )}

              {/* Question 8: Geopoint GPS */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-200">
                    {questions[7].label} <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">type: geopoint</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSimulateGps}
                    disabled={isGpsLoading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isGpsLoading ? 'Locking Satellites...' : 'Record GPS Coordinates'}</span>
                  </button>
                  <span className="text-xs font-mono text-slate-300 truncate">
                    {formData.gps_location || 'No GPS coordinates recorded'}
                  </span>
                </div>
                {formErrors.gps_location && (
                  <p className="text-[11px] text-rose-400">{formErrors.gps_location}</p>
                )}
              </div>
            </div>

            {/* Bottom Finalize Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50 active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Save Form and Finalize Submission</span>
              </button>
            </div>
          </form>
        )}

        {/* XLSFORM SPECIFICATION MODE */}
        {activeTab === 'xlsform' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-1">XLSForm Survey Worksheet (.xlsx)</h3>
              <p className="text-xs text-slate-400 mb-3">
                This is the actual structure you write in Excel or Google Sheets to build Kobo Collect forms.
              </p>

              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 text-left">type</th>
                      <th className="px-3 py-2 text-left">name</th>
                      <th className="px-3 py-2 text-left">label</th>
                      <th className="px-3 py-2 text-left text-amber-400">relevant (Skip Logic)</th>
                      <th className="px-3 py-2 text-left text-cyan-400">constraint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="px-3 py-2 text-teal-400">text</td>
                      <td className="px-3 py-2 text-slate-300">surveyor_name</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Name of Field Enumerator</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-teal-400">select_one zones</td>
                      <td className="px-3 py-2 text-slate-300">settlement_zone</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Settlement Zone / Camp Location</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-teal-400">integer</td>
                      <td className="px-3 py-2 text-slate-300">household_size</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Persons in shelter</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                      <td className="px-3 py-2 text-cyan-300 font-bold">. &gt;= 1 and . &lt;= 30</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-teal-400">select_one water</td>
                      <td className="px-3 py-2 text-slate-300">primary_water</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Primary drinking water source</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                    </tr>
                    <tr className="bg-amber-950/20">
                      <td className="px-3 py-2 text-amber-300">integer</td>
                      <td className="px-3 py-2 text-slate-300">muac_mm</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Child MUAC (mm)</td>
                      <td className="px-3 py-2 text-amber-400 font-bold">${`{child_malnourished} = 'yes'`}</td>
                      <td className="px-3 py-2 text-cyan-300 font-bold">. &gt;= 60 and . &lt;= 220</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-teal-400">geopoint</td>
                      <td className="px-3 py-2 text-slate-300">shelter_gps</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">Shelter GPS Coordinates</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                      <td className="px-3 py-2 text-slate-600">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSIONS & EXPORT MODE */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Collected Field Records ({submissions.length})</h3>
                <p className="text-xs text-slate-400">Synchronized survey records ready for data pipelines</p>
              </div>

              <button
                onClick={exportSubmissionsCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to CSV / Excel</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead className="bg-slate-900 font-mono text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left">Record ID</th>
                    <th className="px-3 py-2 text-left">Timestamp</th>
                    <th className="px-3 py-2 text-left">Zone</th>
                    <th className="px-3 py-2 text-right">HH Size</th>
                    <th className="px-3 py-2 text-left">Water Source</th>
                    <th className="px-3 py-2 text-left">Child Malnourished?</th>
                    <th className="px-3 py-2 text-right">MUAC (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-900/50">
                      <td className="px-3 py-2 text-teal-400 font-semibold">{sub.id}</td>
                      <td className="px-3 py-2 text-slate-500">{sub.submittedAt}</td>
                      <td className="px-3 py-2 text-slate-300">{sub.data.settlement_zone}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{sub.data.household_size}</td>
                      <td className="px-3 py-2 text-slate-300 truncate max-w-[150px]">{sub.data.primary_water_source}</td>
                      <td className="px-3 py-2 text-slate-300">{sub.data.child_malnourished_screening}</td>
                      <td className="px-3 py-2 text-right text-amber-400 font-semibold">
                        {sub.data.muac_score_mm || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
