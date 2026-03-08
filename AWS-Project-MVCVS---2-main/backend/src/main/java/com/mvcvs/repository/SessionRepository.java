package com.mvcvs.repository;

import com.mvcvs.entity.Session;
import com.mvcvs.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser(User user);
    List<Session> findByUserId(Long userId);
}

