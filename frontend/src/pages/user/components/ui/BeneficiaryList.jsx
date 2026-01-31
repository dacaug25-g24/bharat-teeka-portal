export default function BeneficiaryList({
  beneficiaries,
  loadingList,
  relations,
  onDelete,
  isParent,
}) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <h6 className="fw-semibold mb-0">Your Beneficiaries</h6>
          <span className="badge text-bg-light">{beneficiaries.length}</span>
        </div>

        {loadingList ? (
          <div className="text-muted">Loading...</div>
        ) : beneficiaries.length === 0 ? (
          <div className="text-muted">No beneficiaries added yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Relation</th>
                  <th>Blood</th>
                  <th>Patient ID</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {beneficiaries.map((b) => {
                  const relationName =
                    relations.find((r) => r.id === b.relationId)?.name || "-";

                  return (
                    <tr key={b.patientId}>
                      <td className="fw-semibold">
                        {b.firstName} {b.lastName}
                      </td>
                      <td>{b.dateOfBirth}</td>
                      <td>{b.gender}</td>
                      <td>{relationName}</td>
                      <td>{b.bloodGroup}</td>
                      <td>{b.patientId}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(b.patientId)}
                          disabled={!isParent}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isParent && (
              <div className="text-muted small mt-2">
                Only Parent users can delete beneficiaries.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
