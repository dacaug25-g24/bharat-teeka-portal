import useBeneficiaries from "./hooks/useBeneficiaries";
import BeneficiaryForm from "./ui/BeneficiaryForm";
import BeneficiaryList from "./ui/BeneficiaryList";

export default function AddBeneficiary() {
  const {
    isParent,
    beneficiaries,
    loadingList,
    submitting,
    form,
    onChange,
    resetForm,
    error,
    success,
    relations,
    handleSubmit,
    handleDelete,
  } = useBeneficiaries();

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="mb-1">Beneficiaries</h5>
          <div className="text-muted small">Add and manage beneficiaries.</div>
        </div>
      </div>

      {!isParent && (
        <div className="alert alert-warning border-0">
          Only <b>Parent</b> users can manage beneficiaries.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-3">
        {/* Left side: form */}
        <div className="col-12 col-lg-5">
          <BeneficiaryForm
            isParent={isParent}
            form={form}
            onChange={onChange}
            onSubmit={handleSubmit}
            onReset={resetForm}
            submitting={submitting}
            relations={relations}
          />
        </div>

        {/* Right side: list */}
        <div className="col-12 col-lg-7">
          <BeneficiaryList
            beneficiaries={beneficiaries}
            loadingList={loadingList}
            relations={relations}
            onDelete={handleDelete}
            isParent={isParent}
          />
        </div>
      </div>
    </div>
  );
}
