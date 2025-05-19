import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useAtom } from "jotai";

import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

import { historyAtom, fetchHistoryAtom } from "../../store/globalAtom";

function StockMovementTable() {
  const [stockMovements] = useAtom(historyAtom);
  const [, fetchHistory] = useAtom(fetchHistoryAtom);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (stockMovements.length==0) {
      const loadData = async () => {
        setIsLoading(true);
        await fetchHistory();
      };
      loadData();
    }

    setIsLoading(false);
  }, [fetchHistory]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;

    return sortDirection === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
    );
  };

  const filteredMovements = stockMovements
    .filter((movement) => {
      const matchesSearch =
        movement.medicationName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        movement.reason?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction =
        actionFilter === "" || movement.action === actionFilter;

      let matchesDateRange = true;
      if (dateRangeStart) {
        const movementDate =
          typeof movement.date === "string" ? parseISO(movement.date) : null;
        const startDate = new Date(dateRangeStart);
        startDate.setHours(0, 0, 0, 0);

        matchesDateRange =
          movementDate &&
          !isNaN(movementDate.getTime()) &&
          movementDate >= startDate;
      }

      if (dateRangeEnd && matchesDateRange) {
        const movementDate =
          typeof movement.date === "string" ? parseISO(movement.date) : null;
        const endDate = new Date(dateRangeEnd);
        endDate.setHours(23, 59, 59, 999);

        matchesDateRange =
          movementDate &&
          !isNaN(movementDate.getTime()) &&
          movementDate <= endDate;
      }

      return matchesSearch && matchesAction && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortColumn === "date") {
        const dateA = typeof a.date === "string" ? parseISO(a.date) : null;
        const dateB = typeof b.date === "string" ? parseISO(b.date) : null;

        if (!dateA && !dateB) return 0;
        if (!dateA) return sortDirection === "asc" ? 1 : -1;
        if (!dateB) return sortDirection === "asc" ? -1 : 1;

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      if (sortColumn === "quantity") {
        const quantityA = typeof a.quantity === "number" ? a.quantity : 0;
        const quantityB = typeof b.quantity === "number" ? b.quantity : 0;
        return sortDirection === "asc"
          ? quantityA - quantityB
          : quantityB - quantityA;
      }

      const valueA = a[sortColumn]?.toLowerCase() || "";
      const valueB = b[sortColumn]?.toLowerCase() || "";

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5" className="table-cell text-center py-4">
            Chargement des mouvements...
          </td>
        </tr>
      );
    }

    if (filteredMovements.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="table-cell text-center py-4">
            Aucun mouvement trouvé.
          </td>
        </tr>
      );
    }

    return filteredMovements.map((movement) => (
      <tr key={movement.id} className="table-row">
        <td className="table-cell">
          {typeof movement.date === "string" &&
          !isNaN(parseISO(movement.date).getTime())
            ? format(parseISO(movement.date), "dd/MM/yyyy HH:mm", {
                locale: fr,
              })
            : "Date invalide"}
        </td>
        <td className="table-cell">
          <span
            className={
              movement.action === "Entrée" ? "badge-success" : "badge-warning"
            }
          >
            {movement.action}
          </span>
        </td>
        <td className="table-cell font-medium">{movement.medicationName}</td>
        <td className="table-cell">{movement.quantity}</td>
        <td className="table-cell">{movement.reason}</td>
      </tr>
    ));
  };

  return (
    <div className="card space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher médicament ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center"
        >
          <FunnelIcon className="w-4 h-4 mr-1" />
          Filtres
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-full md:w-1/3">
            <label htmlFor="action-filter" className="form-label">
              Type
            </label>
            <select
              id="action-filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Tous</option>
              <option value="Entrée">Entrées</option>
              <option value="Sortie">Sorties</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="date-start" className="form-label">
              Date début
            </label>
            <input
              type="date"
              id="date-start"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="date-end" className="form-label">
              Date fin
            </label>
            <input
              type="date"
              id="date-end"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <span className="flex items-center">
                  Date {getSortIcon("date")}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort("action")}
              >
                <span className="flex items-center">
                  Action {getSortIcon("action")}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort("medicationName")}
              >
                <span className="flex items-center">
                  Médicament {getSortIcon("medicationName")}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                <span className="flex items-center">
                  Quantité {getSortIcon("quantity")}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort("reason")}
              >
                <span className="flex items-center">
                  Motif {getSortIcon("reason")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default StockMovementTable;
