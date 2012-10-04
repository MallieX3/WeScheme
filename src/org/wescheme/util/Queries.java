package org.wescheme.util;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
	
import org.wescheme.project.Program;
	
/**
 * Centralizes all of the queries we're doing on the database.
 * @author dyoo
 *
 */
public class Queries {
	@SuppressWarnings("unchecked")
	public static List<Program> getBacklinkedPrograms(PersistenceManager pm,
			Long programId) {
		Query query = pm.newQuery(Program.class);
		query.setFilter("backlink_ == id");
		query.setOrdering("time_ desc");
		query.declareParameters("Long id");
		try {
			List<Program> pl = (List<Program>) query.execute(programId);
			return pl;
		} finally {
			query.closeAll();
		}
	}
	
	/**
	 * Returns the list of programs for a given user, ordered by modification time descending.
	 * @param pm
	 * @param userName
	 * @return
	 */
	public static List<Program> getUserPrograms(PersistenceManager pm, String userName) {
		Query query = pm.newQuery(Program.class);
		query.setFilter("owner_ == ownerParam");
		query.setOrdering("time_ desc");
		query.declareParameters("String ownerParam");		       
		try {
			@SuppressWarnings({ "unchecked" })
			    List<Program> pl = (List<Program>) 
			    query.execute(userName);
			return pl;
		} finally {
			query.closeAll();
		}
	}

	
	
	@SuppressWarnings("unchecked")
	/**
	 * Returns the program with the given public id with the highest revision id.
	 * If no such unique program exists, returns null.
	 */
	public static Program getProgramByPublicId(PersistenceManager pm, String publicId) {
		javax.jdo.Query query = pm.newQuery(Program.class);
		query.setFilter("publicId_ == param");
		query.declareParameters("String param");
		query.setOrdering("revision desc");
		try {
			List<Program> programs = (List<Program>) query.execute(publicId);
			if (programs.size() > 0) {
				return programs.get(0);
			} else {
				return null;
			}
		} finally { 
			query.closeAll();
		}		
	}

	public static Program getProgramByPublicIdAndRevision(PersistenceManager pm, String publicId, int revision) {
		javax.jdo.Query query = pm.newQuery(Program.class);
		query.setFilter("publicId_ == pid && revision == rev");
		query.declareParameters("String pid, int rev");
		try {
			List<Program> programs = (List<Program>) query.execute(publicId, revision);
			if (programs.size() == 1) {
				return programs.get(0);
			} else {
				return null;
			}
		} finally { 
			query.closeAll();
		}		
	}

	
}
